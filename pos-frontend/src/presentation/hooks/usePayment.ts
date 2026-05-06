import { useState, useCallback } from 'react'
import { useOrderStore } from '@presentation/store/orderStore'
import { useUIStore } from '@presentation/store/uiStore'
import { container } from '@composition/container'
import { Money } from '@domain/value-objects/Money'
import { PaymentMethod } from '@domain/value-objects/OrderStatus'
import { PaymentPartial } from '@domain/entities/Payment'

export function usePayment() {
  const { activeOrder, upsertOrder, removeOrder } = useOrderStore()
  const { addToast, setCompletedPayment, closePaymentModal } = useUIStore()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pay = useCallback(async (
    method: PaymentMethod,
    amountReceived?: number,
    partials?: PaymentPartial[],
  ) => {
    if (!activeOrder) return
    setProcessing(true)
    setError(null)
    try {
      let result
      if (method === 'mixed' && partials) {
        result = await container.processMixedPayment.execute(activeOrder, partials)
      } else {
        const received = amountReceived != null ? Money.fromAmount(amountReceived) : undefined
        result = await container.processPayment.execute(activeOrder, method, received)
      }

      if (result.payment.status === 'approved') {
        upsertOrder(result.order)
        setCompletedPayment(result.payment)
        closePaymentModal()
        addToast('Payment approved! 🎉', 'success')
      } else {
        setError(result.payment.errorMessage ?? 'Payment failed')
        addToast('Payment failed. Please try again.', 'error')
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment error'
      setError(msg)
      addToast(msg, 'error')
    } finally {
      setProcessing(false)
    }
  }, [activeOrder, upsertOrder, setCompletedPayment, closePaymentModal, addToast])

  return { pay, processing, error, setError }
}
