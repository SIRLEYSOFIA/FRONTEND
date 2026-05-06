import { Discount } from '@domain/value-objects/Discount'
import { Money } from '@domain/value-objects/Money'
import { UserRole } from '@domain/value-objects/OrderStatus'

export const SUPERVISOR_DISCOUNT_THRESHOLD = 20 // percent

export type DiscountRuleResult =
  | { allowed: true; requiresSupervisor: false }
  | { allowed: true; requiresSupervisor: true }
  | { allowed: false; reason: string }

/**
 * Determines if a discount requires supervisor approval.
 * Discounts > 20% of the base amount require a supervisor.
 */
export function evaluateDiscount(
  discount: Discount,
  baseAmount: Money,
  currentUserRole: UserRole,
): DiscountRuleResult {
  const pct = discount.getPercentageOf(baseAmount)

  if (pct > 100) {
    return { allowed: false, reason: 'Discount cannot exceed 100% of the item price.' }
  }

  if (pct > SUPERVISOR_DISCOUNT_THRESHOLD) {
    if (currentUserRole === 'supervisor' || currentUserRole === 'admin') {
      return { allowed: true, requiresSupervisor: false }
    }
    return { allowed: true, requiresSupervisor: true }
  }

  return { allowed: true, requiresSupervisor: false }
}
