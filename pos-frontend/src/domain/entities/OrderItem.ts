import { Money } from '@domain/value-objects/Money'
import { Discount } from '@domain/value-objects/Discount'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  unitPrice: Money
  taxRate: number
  discount: Discount
  lineTotal: Money // (unitPrice * quantity) - discount applied
  lineTax: Money
}

/**
 * Calculates the line total for an order item.
 * lineTotal = (unitPrice * quantity) - discountAmount
 */
export function calculateLineTotal(
  unitPrice: Money,
  quantity: number,
  discount: Discount,
): { lineSubtotal: Money; discountAmount: Money; lineTotal: Money } {
  const lineSubtotal = unitPrice.multiply(quantity)
  const discountAmount = discount.apply(lineSubtotal)
  const lineTotal = lineSubtotal.subtract(discountAmount)
  return { lineSubtotal, discountAmount, lineTotal }
}

export function calculateLineTax(lineTotal: Money, taxRate: number): Money {
  return lineTotal.multiply(taxRate)
}

export function createOrderItem(data: {
  id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  unitPrice: Money
  taxRate?: number
  discount?: Discount
}): OrderItem {
  const discount = data.discount ?? Discount.none()
  const taxRate = data.taxRate ?? 0
  const { lineTotal } = calculateLineTotal(data.unitPrice, data.quantity, discount)
  const lineTax = calculateLineTax(lineTotal, taxRate)

  return {
    id: data.id,
    productId: data.productId,
    productName: data.productName,
    productSku: data.productSku,
    quantity: data.quantity,
    unitPrice: data.unitPrice,
    taxRate,
    discount,
    lineTotal,
    lineTax,
  }
}

export function updateOrderItemQuantity(item: OrderItem, quantity: number): OrderItem {
  if (quantity <= 0) throw new Error('Quantity must be greater than 0')
  const { lineTotal } = calculateLineTotal(item.unitPrice, quantity, item.discount)
  const lineTax = calculateLineTax(lineTotal, item.taxRate)
  return { ...item, quantity, lineTotal, lineTax }
}

export function updateOrderItemDiscount(item: OrderItem, discount: Discount): OrderItem {
  const { lineTotal } = calculateLineTotal(item.unitPrice, item.quantity, discount)
  const lineTax = calculateLineTax(lineTotal, item.taxRate)
  return { ...item, discount, lineTotal, lineTax }
}
