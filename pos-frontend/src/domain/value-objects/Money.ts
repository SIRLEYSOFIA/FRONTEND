/**
 * Money Value Object
 * Immutable representation of a monetary amount.
 * All arithmetic uses integer cents to avoid floating-point errors.
 */
export class Money {
  private readonly cents: number

  private constructor(cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error(`Money cents must be an integer, got: ${cents}`)
    }
    this.cents = cents
  }

  static fromCents(cents: number): Money {
    return new Money(Math.round(cents))
  }

  static fromAmount(amount: number): Money {
    return new Money(Math.round(amount * 100))
  }

  static zero(): Money {
    return new Money(0)
  }

  static fromString(value: string): Money {
    const parsed = parseFloat(value)
    if (isNaN(parsed)) throw new Error(`Cannot parse Money from: ${value}`)
    return Money.fromAmount(parsed)
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents)
  }

  subtract(other: Money): Money {
    const result = this.cents - other.cents
    if (result < 0) throw new Error('Money subtraction would result in negative value')
    return new Money(result)
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.cents * factor))
  }

  isGreaterThanOrEqual(other: Money): boolean {
    return this.cents >= other.cents
  }

  isLessThan(other: Money): boolean {
    return this.cents < other.cents
  }

  isZero(): boolean {
    return this.cents === 0
  }

  equals(other: Money): boolean {
    return this.cents === other.cents
  }

  toAmount(): number {
    return this.cents / 100
  }

  toCents(): number {
    return this.cents
  }

  toString(): string {
    return this.toAmount().toFixed(2)
  }

  format(currency = 'USD', locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(this.toAmount())
  }
}
