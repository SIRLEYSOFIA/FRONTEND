import { Money } from '@domain/value-objects/Money'
import { PaymentMethod, PaymentStatus } from '@domain/value-objects/OrderStatus'
import { PaymentPartial } from '@domain/entities/Payment'

export interface PaymentRequest {
  orderId: string
  method: PaymentMethod
  amount: Money
  amountReceived?: Money  // for cash
  partials?: PaymentPartial[] // for mixed
}

export interface PaymentResult {
  transactionId: string
  status: PaymentStatus
  change?: Money
  errorMessage?: string
}

export interface TransactionStatus {
  transactionId: string
  status: PaymentStatus
  errorMessage?: string
}

export interface IPaymentGateway {
  process(request: PaymentRequest): Promise<PaymentResult>
  getStatus(transactionId: string): Promise<TransactionStatus>
  cancel(transactionId: string): Promise<void>
}
