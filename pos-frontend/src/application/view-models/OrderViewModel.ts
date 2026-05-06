import { Order } from '@domain/entities/Order'
import { OrderItem } from '@domain/entities/OrderItem'

export interface OrderItemViewModel {
  id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  unitPriceFormatted: string
  unitPriceAmount: number
  discountLabel: string
  hasDiscount: boolean
  lineTotalFormatted: string
  lineTotalAmount: number
}

export interface OrderViewModel {
  id: string
  items: OrderItemViewModel[]
  itemCount: number
  subtotalFormatted: string
  taxFormatted: string
  orderDiscountFormatted: string
  hasOrderDiscount: boolean
  totalFormatted: string
  totalAmount: number
  status: string
  isEmpty: boolean
  canBeConfirmed: boolean
  canBePaid: boolean
}

export function toOrderItemViewModel(item: OrderItem): OrderItemViewModel {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    productSku: item.productSku,
    quantity: item.quantity,
    unitPriceFormatted: item.unitPrice.format(),
    unitPriceAmount: item.unitPrice.toAmount(),
    discountLabel: item.discount.isNone() ? '' : item.discount.toString(),
    hasDiscount: !item.discount.isNone(),
    lineTotalFormatted: item.lineTotal.format(),
    lineTotalAmount: item.lineTotal.toAmount(),
  }
}

export function toOrderViewModel(order: Order): OrderViewModel {
  return {
    id: order.id,
    items: order.items.map(toOrderItemViewModel),
    itemCount: order.items.reduce((acc, i) => acc + i.quantity, 0),
    subtotalFormatted: order.subtotal.format(),
    taxFormatted: order.taxAmount.format(),
    orderDiscountFormatted: order.orderDiscountAmount.isZero()
      ? ''
      : `-${order.orderDiscountAmount.format()}`,
    hasOrderDiscount: !order.orderDiscountAmount.isZero(),
    totalFormatted: order.total.format(),
    totalAmount: order.total.toAmount(),
    status: order.status,
    isEmpty: order.items.length === 0,
    canBeConfirmed: order.status === 'draft' && order.items.length > 0,
    canBePaid: order.status === 'confirmed',
  }
}
