import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { Money } from '@domain/value-objects/Money'
import { calculateChange } from '@domain/entities/Payment'

const amountArb = fc.integer({ min: 1, max: 1_000_000 })

describe('Cash Payment — Property-Based Tests', () => {
  it('change invariant: change = received - total when received >= total', () => {
    fc.assert(fc.property(amountArb, amountArb, (a, b) => {
      const total    = Money.fromCents(Math.min(a, b))
      const received = Money.fromCents(Math.max(a, b))
      const change   = calculateChange(received, total)
      expect(change.toCents()).toBe(received.toCents() - total.toCents())
    }))
  })

  it('change non-negativity: change is always >= 0', () => {
    fc.assert(fc.property(amountArb, amountArb, (a, b) => {
      const total    = Money.fromCents(Math.min(a, b))
      const received = Money.fromCents(Math.max(a, b))
      const change   = calculateChange(received, total)
      expect(change.toCents()).toBeGreaterThanOrEqual(0)
    }))
  })

  it('insufficient amount: throws when received < total', () => {
    fc.assert(fc.property(
      fc.integer({ min: 2, max: 1_000_000 }),
      (total) => {
        const received = Money.fromCents(total - 1)
        const totalMoney = Money.fromCents(total)
        expect(() => calculateChange(received, totalMoney)).toThrow()
      }
    ))
  })
})
