import { Money } from './Money'

export type DiscountType = 'percentage' | 'fixed'

/**
 * Discount Value Object
 * Represents a discount as either a percentage or a fixed amount.
 */
export class Discount {
  readonly type: DiscountType
  readonly value: number // percentage (0-100) or fixed amount in dollars

  private constructor(type: DiscountType, value: number) {
    if (value < 0) throw new Error('Discount value cannot be negative')
    if (type === 'percentage' && value > 100) {
      throw new Error('Percentage discount cannot exceed 100%')
    }
    this.type = type
    this.value = value
  }

  static percentage(pct: number): Discount {
    return new Discount('percentage', pct)
  }

  static fixed(amount: number): Discount {
    return new Discount('fixed', amount)
  }

  static none(): Discount {
    return new Discount('percentage', 0)
  }

  apply(baseAmount: Money): Money {
    if (this.type === 'percentage') {
      return baseAmount.multiply(this.value / 100)
    }
    const fixedMoney = Money.fromAmount(this.value)
    if (fixedMoney.isGreaterThanOrEqual(baseAmount)) {
      return baseAmount
    }
    return fixedMoney
  }

  isNone(): boolean {
    return this.value === 0
  }

  getPercentageOf(baseAmount: Money): number {
    if (this.type === 'percentage') return this.value
    if (baseAmount.isZero()) return 0
    return (Money.fromAmount(this.value).toCents() / baseAmount.toCents()) * 100
  }

  toString(): string {
    if (this.type === 'percentage') return `${this.value}%`
    return `$${this.value.toFixed(2)}`
  }
}
