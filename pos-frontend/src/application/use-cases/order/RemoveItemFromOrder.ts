import { IOrderRepository } from '@application/ports/repositories/IOrderRepository'
import { Order, recalculateOrder } from '@domain/entities/Order'

export class RemoveItemFromOrder {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(order: Order, itemId: string): Promise<Order> {
    if (order.status !== 'draft') {
      throw new Error('Cannot remove items from a non-draft order')
    }

    const updatedItems = order.items.filter((item) => item.id !== itemId)
    const updatedOrder = recalculateOrder({ ...order, items: updatedItems })
    await this.orderRepository.save(updatedOrder)
    return updatedOrder
  }
}
