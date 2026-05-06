import { IOrderRepository } from '@application/ports/repositories/IOrderRepository'
import { Order, recalculateOrder } from '@domain/entities/Order'
import { Product } from '@domain/entities/Product'
import { createOrderItem, updateOrderItemQuantity } from '@domain/entities/OrderItem'
import { validateOrderCanBeConfirmed } from '@domain/rules/OrderRules'
import { generateId } from '@shared/utils/generateId'

export class AddItemToOrder {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(order: Order, product: Product, quantity = 1): Promise<Order> {
    if (order.status !== 'draft') {
      throw new Error('Cannot add items to a non-draft order')
    }

    const existingItemIndex = order.items.findIndex(
      (item) => item.productId === product.id,
    )

    let updatedItems = [...order.items]

    if (existingItemIndex >= 0) {
      const existing = updatedItems[existingItemIndex]
      updatedItems[existingItemIndex] = updateOrderItemQuantity(
        existing,
        existing.quantity + quantity,
      )
    } else {
      const newItem = createOrderItem({
        id: generateId(),
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity,
        unitPrice: product.price,
        taxRate: product.taxRate,
      })
      updatedItems = [...updatedItems, newItem]
    }

    const updatedOrder = recalculateOrder({ ...order, items: updatedItems })
    await this.orderRepository.save(updatedOrder)
    return updatedOrder
  }
}
