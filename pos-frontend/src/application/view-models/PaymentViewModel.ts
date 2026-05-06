import { Payment } from '@domain/entities/Payment'

export interface PaymentViewModel {
  id: string
  orderId: string
  method: string
  amountFormatted: string
  amountReceivedFormatted: string
  changeFormatted: string
  status: string
  isApproved: boolean
  isFailed: boolean
  isProcessing: boolean
  transactionId: string
  errorMessage: string | null
  processedAt: string | null
}

export function toPaymentViewModel(payment: Payment): PaymentViewModel {
  return {
    id: payment.id,
    orderId: payment.orderId,
    method: payment.method,
    amountFormatted: payment.amount.format(),
    amountReceivedFormatted: payment.amountReceived.format(),
    changeFormatted: payment.change.format(),
    status: payment.status,
    isApproved: payment.status === 'approved',
    isFailed: payment.status === 'failed',
    isProcessing: payment.status === 'processing' || payment.status === 'pending',
    transactionId: payment.transactionId,
    errorMessage: payment.errorMessage,
    processedAt: payment.processedAt
      ? payment.processedAt.toLocaleString('en-US')
      : null,
  }
}
