import { Money } from '@domain/value-objects/Money'
import { PaymentMethod, PaymentStatus } from '@domain/value-objects/OrderStatus'

export interface PaymentPartial {
  method: Exclude<PaymentMethod, 'mixed'>
  amount: Money
}

export interface Payment {
  id: string
  orderId: string
  method: PaymentMethod
  amount: Money
  amountReceived: Money   // for cash: amount tendered
  change: Money           // for cash: change to return
  partials: PaymentPartial[] // for mixed payments
  status: PaymentStatus
  transactionId: string
  processedAt: Date | null
  errorMessage: string | null
}

export function createPayment(data: {
  id: string
  orderId: string
  method: PaymentMethod
  amount: Money
}): Payment {
  return {
    id: data.id,
    orderId: data.orderId,
    method: data.method,
    amount: data.amount,
    amountReceived: Money.zero(),
    change: Money.zero(),
    partials: [],
    status: 'idle',
    transactionId: '',
    processedAt: null,
    errorMessage: null,
  }
}

export function calculateChange(amountReceived: Money, total: Money): Money {
  if (amountReceived.isLessThan(total)) {
    throw new Error('Insufficient amount: received less than total')
  }
  return amountReceived.subtract(total)
}
