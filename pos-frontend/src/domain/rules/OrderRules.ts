import { Order } from '@domain/entities/Order'

export type RuleResult = { valid: true } | { valid: false; reason: string }

/**
 * Validates that an order can be confirmed (has at least one item).
 */
export function validateOrderCanBeConfirmed(order: Order): RuleResult {
  if (order.items.length === 0) {
    return { valid: false, reason: 'Order must contain at least one product before confirming.' }
  }
  if (order.status !== 'draft') {
    return { valid: false, reason: `Order cannot be confirmed from status: ${order.status}` }
  }
  return { valid: true }
}

/**
 * Validates that an order can be paid.
 */
export function validateOrderCanBePaid(order: Order): RuleResult {
  if (order.status !== 'confirmed') {
    return { valid: false, reason: `Order must be confirmed before payment. Current status: ${order.status}` }
  }
  if (order.items.length === 0) {
    return { valid: false, reason: 'Cannot pay an empty order.' }
  }
  return { valid: true }
}

/**
 * Validates that an order can be cancelled.
 */
export function validateOrderCanBeCancelled(order: Order): RuleResult {
  if (order.status === 'paid') {
    return { valid: false, reason: 'A paid order cannot be cancelled.' }
  }
  return { valid: true }
}
