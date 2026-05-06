import { IOrderRepository } from '@application/ports/repositories/IOrderRepository'
import { Order } from '@domain/entities/Order'
import { validateOrderCanBeConfirmed } from '@domain/rules/OrderRules'

export class ConfirmOrder {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(order: Order): Promise<Order> {
    const validation = validateOrderCanBeConfirmed(order)
    if (!validation.valid) {
      throw new Error(validation.reason)
    }

    const confirmedOrder: Order = {
      ...order,
      status: 'confirmed',
      updatedAt: new Date(),
    }

    await this.orderRepository.save(confirmedOrder)
    return confirmedOrder
  }
}
