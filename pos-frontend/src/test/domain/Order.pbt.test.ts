import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { Money } from '@domain/value-objects/Money'
import { Discount } from '@domain/value-objects/Discount'
import { createOrder, recalculateOrder } from '@domain/entities/Order'
import { createOrderItem } from '@domain/entities/OrderItem'

const priceArb = fc.integer({ min: 50, max: 50_000 }) // 0.50 to 500.00
const qtyArb   = fc.integer({ min: 1, max: 20 })

function makeItem(id: string, priceCents: number, qty: number) {
  return createOrderItem({
    id,
    productId: `prod-${id}`,
    productName: `Product ${id}`,
    productSku: `SKU-${id}`,
    quantity: qty,
    unitPrice: Money.fromCents(priceCents),
    taxRate: 0.08,
  })
}

describe('Order totals — Property-Based Tests', () => {
  it('total invariant: total = sum(lineTotals) + taxAmount - orderDiscount', () => {
    fc.assert(fc.property(
      fc.array(fc.tuple(priceArb, qtyArb), { minLength: 1, maxLength: 10 }),
      (itemData) => {
        const order = createOrder({ id: 'o1', cashierId: 'c1', shiftId: 's1' })
        const items = itemData.map(([price, qty], i) => makeItem(`${i}`, price, qty))
        const withItems = recalculateOrder({ ...order, items })

        const expectedSubtotal = items.reduce((acc, i) => acc.add(i.lineTotal), Money.zero())
        const expectedTax      = items.reduce((acc, i) => acc.add(i.lineTax),   Money.zero())
        const expectedTotal    = expectedSubtotal.add(expectedTax)

        expect(withItems.subtotal.toCents()).toBe(expectedSubtotal.toCents())
        expect(withItems.taxAmount.toCents()).toBe(expectedTax.toCents())
        expect(withItems.total.toCents()).toBe(expectedTotal.toCents())
      }
    ))
  })

  it('monotonicity on add: adding a positive-price item increases total', () => {
    fc.assert(fc.property(priceArb, qtyArb, (price, qty) => {
      const order = createOrder({ id: 'o1', cashierId: 'c1', shiftId: 's1' })
      const item  = makeItem('new', price, qty)
      const after = recalculateOrder({ ...order, items: [item] })
      expect(after.total.toCents()).toBeGreaterThan(0)
    }))
  })

  it('recalculation idempotency: recalculate twice = recalculate once', () => {
    fc.assert(fc.property(
      fc.array(fc.tuple(priceArb, qtyArb), { minLength: 1, maxLength: 5 }),
      (itemData) => {
        const order = createOrder({ id: 'o1', cashierId: 'c1', shiftId: 's1' })
        const items = itemData.map(([price, qty], i) => makeItem(`${i}`, price, qty))
        const once  = recalculateOrder({ ...order, items })
        const twice = recalculateOrder(once)
        expect(twice.total.toCents()).toBe(once.total.toCents())
      }
    ))
  })

  it('discount invariant: total with discount <= total without discount', () => {
    fc.assert(fc.property(priceArb, qtyArb, fc.integer({ min: 1, max: 20 }), (price, qty, pct) => {
      const order = createOrder({ id: 'o1', cashierId: 'c1', shiftId: 's1' })
      const items = [makeItem('x', price, qty)]
      const base  = recalculateOrder({ ...order, items })
      const withDiscount = recalculateOrder({ ...base, orderDiscount: Discount.percentage(pct) })
      expect(withDiscount.total.toCents()).toBeLessThanOrEqual(base.total.toCents())
    }))
  })
})
