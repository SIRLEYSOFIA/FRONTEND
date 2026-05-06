import { IPaymentGateway, PaymentRequest } from '@application/ports/services/IPaymentGateway'
import { IOrderRepository } from '@application/ports/repositories/IOrderRepository'
import { Order } from '@domain/entities/Order'
import { Payment, createPayment, PaymentPartial } from '@domain/entities/Payment'
import { Money } from '@domain/value-objects/Money'
import { validateOrderCanBePaid } from '@domain/rules/OrderRules'
import { generateId } from '@shared/utils/generateId'

export class ProcessMixedPayment {
  constructor(
    private readonly paymentGateway: IPaymentGateway,
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    order: Order,
    partials: PaymentPartial[],
  ): Promise<{ payment: Payment; order: Order }> {
    const validation = validateOrderCanBePaid(order)
    if (!validation.valid) throw new Error(validation.reason)

    // Validate that partials sum equals order total
    const partialsTotal = partials.reduce(
      (acc, p) => acc.add(p.amount),
      Money.zero(),
    )

    if (!partialsTotal.equals(order.total)) {
      throw new Error(
        `Mixed payment partials (${partialsTotal.format()}) must equal order total (${order.total.format()})`,
      )
    }

    const processingOrder: Order = { ...order, status: 'processing_payment', updatedAt: new Date() }
    await this.orderRepository.save(processingOrder)

    const request: PaymentRequest = {
      orderId: order.id,
      method: 'mixed',
      amount: order.total,
      partials,
    }

    const result = await this.paymentGateway.process(request)

    const payment = createPayment({
      id: generateId(),
      orderId: order.id,
      method: 'mixed',
      amount: order.total,
    })

    const finalPayment: Payment = {
      ...payment,
      amountReceived: order.total,
      partials,
      status: result.status,
      transactionId: result.transactionId,
      processedAt: result.status === 'approved' ? new Date() : null,
      errorMessage: result.errorMessage ?? null,
    }

    const finalOrder: Order = {
      ...processingOrder,
      status: result.status === 'approved' ? 'paid' : 'confirmed',
      updatedAt: new Date(),
    }

    await this.orderRepository.save(finalOrder)
    if (result.status === 'approved') {
      await this.orderRepository.complete(order.id)
    }

    return { payment: finalPayment, order: finalOrder }
  }
}
