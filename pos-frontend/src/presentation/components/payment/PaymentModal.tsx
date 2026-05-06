import { useState } from 'react'
import { Modal } from '@presentation/components/ui/Modal'
import { Button } from '@presentation/components/ui/Button'
import { Input } from '@presentation/components/ui/Input'
import { Spinner } from '@presentation/components/ui/Spinner'
import { usePayment } from '@presentation/hooks/usePayment'
import { PaymentMethod } from '@domain/value-objects/OrderStatus'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  totalFormatted: string
}

const METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'cash', label: 'Cash', icon: '💵' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'qr', label: 'QR Code', icon: '📱' },
]

export function PaymentModal({ isOpen, onClose, totalAmount, totalFormatted }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('cash')
  const [cashReceived, setCashReceived] = useState('')
  const { pay, processing, error, setError } = usePayment()

  const cashAmount = parseFloat(cashReceived) || 0
  const change = method === 'cash' ? Math.max(0, cashAmount - totalAmount) : 0
  const canPay =
    method !== 'cash' || cashAmount >= totalAmount

  const handlePay = async () => {
    await pay(method, method === 'cash' ? cashAmount : undefined)
  }

  const handleClose = () => {
    setCashReceived('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Process Payment — ${totalFormatted}`} size="md">
      <div className="payment-modal">
        {/* Method selector */}
        <div className="payment-methods">
          {METHODS.map((m) => (
            <button
              key={m.id}
              className={`payment-method-btn ${method === m.id ? 'active' : ''}`}
              onClick={() => { setMethod(m.id); setError(null) }}
              aria-pressed={method === m.id}
            >
              <span className="payment-method-icon">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Cash input */}
        {method === 'cash' && (
          <div className="cash-section">
            <Input
              label="Amount Received ($)"
              type="number"
              min={totalAmount}
              step="0.01"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder={totalAmount.toFixed(2)}
              autoFocus
            />
            <div className="change-display">
              <span>Change:</span>
              <span className={`change-amount ${cashAmount > 0 && cashAmount < totalAmount ? 'change-insufficient' : ''}`}>
                {cashAmount > 0 && cashAmount < totalAmount
                  ? '⚠️ Insufficient'
                  : `$${change.toFixed(2)}`}
              </span>
            </div>
          </div>
        )}

        {/* Card status */}
        {method === 'card' && (
          <div className="card-section">
            {processing
              ? <div className="card-waiting"><Spinner /><p>Processing card payment...</p></div>
              : <p className="card-instruction">💳 Present card to terminal and confirm</p>
            }
          </div>
        )}

        {/* QR display */}
        {method === 'qr' && (
          <div className="qr-section">
            <div className="qr-placeholder" aria-label="QR code for payment">
              <div className="qr-mock">
                <div className="qr-inner">📱</div>
              </div>
              <p>Scan with your digital wallet</p>
              <p className="qr-amount">{totalFormatted}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="payment-error" role="alert">
            ❌ {error}
          </div>
        )}

        <div className="modal-footer">
          <Button variant="ghost" onClick={handleClose} disabled={processing}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handlePay}
            disabled={!canPay || processing}
            loading={processing}
          >
            ✅ Confirm Payment
          </Button>
        </div>
      </div>
    </Modal>
  )
}
