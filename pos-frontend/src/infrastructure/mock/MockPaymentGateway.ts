import { IPaymentGateway, PaymentRequest, PaymentResult, TransactionStatus } from '@application/ports/services/IPaymentGateway'
import { generateId } from '@shared/utils/generateId'

/** Simulates a payment gateway with a 1.5s delay and 95% success rate */
export class MockPaymentGateway implements IPaymentGateway {
  private transactions = new Map<string, TransactionStatus>()

  async process(request: PaymentRequest): Promise<PaymentResult> {
    await delay(1500)

    const transactionId = generateId()
    const success = Math.random() > 0.05 // 95% success

    const status = success ? 'approved' : 'failed'
    const result: PaymentResult = {
      transactionId,
      status,
      errorMessage: success ? undefined : 'Card declined. Please try another payment method.',
    }

    this.transactions.set(transactionId, { transactionId, status })
    return result
  }

  async getStatus(transactionId: string): Promise<TransactionStatus> {
    return (
      this.transactions.get(transactionId) ?? {
        transactionId,
        status: 'failed',
        errorMessage: 'Transaction not found',
      }
    )
  }

  async cancel(transactionId: string): Promise<void> {
    this.transactions.set(transactionId, { transactionId, status: 'failed' })
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
