/**
 * Generates a unique ID using crypto.randomUUID when available,
 * falling back to a timestamp-based approach.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
