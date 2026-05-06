import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { Money } from '@domain/value-objects/Money'

// Arbitrary: non-negative integer cents up to $10,000
const moneyCents = fc.integer({ min: 0, max: 1_000_000 })

describe('Money — Property-Based Tests', () => {
  it('addition is commutative: add(a,b) === add(b,a)', () => {
    fc.assert(fc.property(moneyCents, moneyCents, (a, b) => {
      const ma = Money.fromCents(a)
      const mb = Money.fromCents(b)
      expect(ma.add(mb).toCents()).toBe(mb.add(ma).toCents())
    }))
  })

  it('addition is associative: add(add(a,b),c) === add(a,add(b,c))', () => {
    fc.assert(fc.property(moneyCents, moneyCents, moneyCents, (a, b, c) => {
      const ma = Money.fromCents(a)
      const mb = Money.fromCents(b)
      const mc = Money.fromCents(c)
      expect(ma.add(mb).add(mc).toCents()).toBe(ma.add(mb.add(mc)).toCents())
    }))
  })

  it('identity element: add(x, zero) === x', () => {
    fc.assert(fc.property(moneyCents, (a) => {
      const ma = Money.fromCents(a)
      expect(ma.add(Money.zero()).toCents()).toBe(ma.toCents())
    }))
  })

  it('subtraction non-negativity: subtract(a,b) >= 0 when a >= b', () => {
    fc.assert(fc.property(moneyCents, moneyCents, (a, b) => {
      const bigger = Math.max(a, b)
      const smaller = Math.min(a, b)
      const result = Money.fromCents(bigger).subtract(Money.fromCents(smaller))
      expect(result.toCents()).toBeGreaterThanOrEqual(0)
    }))
  })

  it('round-trip serialization: fromString(toString(x)) === x', () => {
    fc.assert(fc.property(moneyCents, (a) => {
      const ma = Money.fromCents(a)
      const restored = Money.fromString(ma.toString())
      expect(restored.toCents()).toBe(ma.toCents())
    }))
  })
})
