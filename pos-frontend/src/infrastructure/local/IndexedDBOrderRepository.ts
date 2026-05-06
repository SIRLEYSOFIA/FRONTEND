import { IOrderRepository } from '@application/ports/repositories/IOrderRepository'
import { Order } from '@domain/entities/Order'
import { Money } from '@domain/value-objects/Money'
import { Discount } from '@domain/value-objects/Discount'
import { getDB } from './db'

/**
 * Serializes an Order to a plain JSON-safe object.
 * Money and Discount are converted to primitives.
 */
function serializeOrder(order: Order): string {
  const plain = {
    ...order,
    subtotal: order.subtotal.toCents(),
    taxAmount: order.taxAmount.toCents(),
    orderDiscountAmount: order.orderDiscountAmount.toCents(),
    total: order.total.toCents(),
    orderDiscount: { type: order.orderDiscount.type, value: order.orderDiscount.value },
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toCents(),
      lineTotal: item.lineTotal.toCents(),
      lineTax: item.lineTax.toCents(),
      discount: { type: item.discount.type, value: item.discount.value },
    })),
  }
  return JSON.stringify(plain)
}

/**
 * Deserializes a plain object back to an Order with proper value objects.
 */
function deserializeOrder(data: string): Order {
  const plain = JSON.parse(data)
  return {
    ...plain,
    subtotal: Money.fromCents(plain.subtotal),
    taxAmount: Money.fromCents(plain.taxAmount),
    orderDiscountAmount: Money.fromCents(plain.orderDiscountAmount),
    total: Money.fromCents(plain.total),
    orderDiscount: plain.orderDiscount.type === 'percentage'
      ? Discount.percentage(plain.orderDiscount.value)
      : Discount.fixed(plain.orderDiscount.value),
    createdAt: new Date(plain.createdAt),
    updatedAt: new Date(plain.updatedAt),
    items: plain.items.map((item: {
      unitPrice: number
      lineTotal: number
      lineTax: number
      discount: { type: string; value: number }
      [key: string]: unknown
    }) => ({
      ...item,
      unitPrice: Money.fromCents(item.unitPrice),
      lineTotal: Money.fromCents(item.lineTotal),
      lineTax: Money.fromCents(item.lineTax),
      discount: item.discount.type === 'percentage'
        ? Discount.percentage(item.discount.value)
        : Discount.fixed(item.discount.value),
    })),
  }
}

export class IndexedDBOrderRepository implements IOrderRepository {
  async save(order: Order): Promise<void> {
    const db = await getDB()
    await db.put('orders', {
      id: order.id,
      data: serializeOrder(order),
      status: order.status,
      updatedAt: order.updatedAt.getTime(),
    })
  }

  async getActive(): Promise<Order[]> {
    const db = await getDB()
    const all = await db.getAll('orders')
    return all
      .filter((r) => r.status !== 'paid' && r.status !== 'cancelled')
      .map((r) => deserializeOrder(r.data))
  }

  async getById(id: string): Promise<Order | null> {
    const db = await getDB()
    const record = await db.get('orders', id)
    if (!record) return null
    return deserializeOrder(record.data)
  }

  async complete(id: string): Promise<void> {
    const db = await getDB()
    const record = await db.get('orders', id)
    if (record) {
      await db.put('orders', { ...record, status: 'paid' })
    }
  }

  async delete(id: string): Promise<void> {
    const db = await getDB()
    await db.delete('orders', id)
  }
}
