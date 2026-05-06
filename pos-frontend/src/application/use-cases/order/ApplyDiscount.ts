import { IOrderRepository } from '@application/ports/repositories/IOrderRepository'
import { Order, recalculateOrder } from '@domain/entities/Order'
import { Discount } from '@domain/value-objects/Discount'
import { UserRole } from '@domain/value-objects/OrderStatus'
import { evaluateDiscount } from '@domain/rules/DiscountRules'
import { updateOrderItemDiscount } from '@domain/entities/OrderItem'

export class ApplyDiscount {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async applyToOrder(
    order: Order,
    discount: Discount,
    userRole: UserRole,
  ): Promise<{ order: Order; requiresSupervisor: boolean }> {
    const result = evaluateDiscount(discount, order.subtotal, userRole)

    if (!result.allowed) {
      throw new Error(result.reason)
    }

    if (result.requiresSupervisor) {
      return { order, requiresSupervisor: true }
    }

    const updatedOrder = recalculateOrder({ ...order, orderDiscount: discount })
    await this.orderRepository.save(updatedOrder)
    return { order: updatedOrder, requiresSupervisor: false }
  }

  async applyToItem(
    order: Order,
    itemId: string,
    discount: Discount,
    userRole: UserRole,
  ): Promise<{ order: Order; requiresSupervisor: boolean }> {
    const item = order.items.find((i) => i.id === itemId)
    if (!item) throw new Error(`Item ${itemId} not found in order`)

    const result = evaluateDiscount(discount, item.unitPrice.multiply(item.quantity), userRole)

    if (!result.allowed) {
      throw new Error(result.reason)
    }

    if (result.requiresSupervisor) {
      return { order, requiresSupervisor: true }
    }

    const updatedItems = order.items.map((i) =>
      i.id === itemId ? updateOrderItemDiscount(i, discount) : i,
    )
    const updatedOrder = recalculateOrder({ ...order, items: updatedItems })
    await this.orderRepository.save(updatedOrder)
    return { order: updatedOrder, requiresSupervisor: false }
  }
}
