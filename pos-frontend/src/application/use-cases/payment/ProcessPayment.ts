import { IPaymentGateway, PaymentRequest, PaymentResult } from '@application/ports/services/IPaymentGateway'
import { IOrderRepository } from '@application/ports/repositories/IOrderRepository'
import { Order } from '@domain/entities/Order'
import { Payment, createPayment, calculateChange } from '@domain/entities/Payment'
import { Money } from '@domain/value-objects/Money'
import { PaymentMethod } from '@domain/value-objects/OrderStatus'
import { validateOrderCanBePaid } from '@domain/rules/OrderRules'
import { generateId } from '@shared/utils/generateId'

export class ProcessPayment {
  constructor(
    private readonly paymentGateway: IPaymentGateway,
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    order: Order,
    method: PaymentMethod,
    amountReceived?: Money,
  ): Promise<{ payment: Payment; order: Order }> {
    const validation = validateOrderCanBePaid(order)
    if (!validation.valid) throw new Error(validation.reason)

    // For cash: validate sufficient amount
    if (method === 'cash' && amountReceived) {
      if (amountReceived.isLessThan(order.total)) {
        throw new Error('Insufficient cash amount')
      }
    }

    const processingOrder: Order = { ...order, status: 'processing_payment', updatedAt: new Date() }
    await this.orderRepository.save(processingOrder)

    const request: PaymentRequest = {
      orderId: order.id,
      method,
      amount: order.total,
      amountReceived,
    }

    const result: PaymentResult = await this.paymentGateway.process(request)

    const payment = createPayment({
      id: generateId(),
      orderId: order.id,
      method,
      amount: order.total,
    })

    const finalPayment: Payment = {
      ...payment,
      amountReceived: amountReceived ?? order.total,
      change: method === 'cash' && amountReceived
        ? calculateChange(amountReceived, order.total)
        : Money.zero(),
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
