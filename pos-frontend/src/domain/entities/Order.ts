import { Money } from '@domain/value-objects/Money'
import { Discount } from '@domain/value-objects/Discount'
import { OrderStatus } from '@domain/value-objects/OrderStatus'
import { OrderItem } from '@domain/entities/OrderItem'

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: Money       // sum of all lineTotals (after item discounts)
  taxAmount: Money      // sum of all lineTax
  orderDiscount: Discount
  orderDiscountAmount: Money
  total: Money          // subtotal + taxAmount - orderDiscountAmount
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
  cashierId: string
  shiftId: string
}

/**
 * Recalculates all monetary totals from the current items and order discount.
 * This is the single source of truth for order totals.
 */
export function recalculateOrder(order: Order): Order {
  const subtotal = order.items.reduce(
    (acc, item) => acc.add(item.lineTotal),
    Money.zero(),
  )
  const taxAmount = order.items.reduce(
    (acc, item) => acc.add(item.lineTax),
    Money.zero(),
  )
  const orderDiscountAmount = order.orderDiscount.apply(subtotal)
  const discountedSubtotal = subtotal.subtract(orderDiscountAmount)
  const total = discountedSubtotal.add(taxAmount)

  return { ...order, subtotal, taxAmount, orderDiscountAmount, total, updatedAt: new Date() }
}

export function createOrder(data: {
  id: string
  cashierId: string
  shiftId: string
}): Order {
  const now = new Date()
  return recalculateOrder({
    id: data.id,
    items: [],
    subtotal: Money.zero(),
    taxAmount: Money.zero(),
    orderDiscount: Discount.none(),
    orderDiscountAmount: Money.zero(),
    total: Money.zero(),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    cashierId: data.cashierId,
    shiftId: data.shiftId,
  })
}
