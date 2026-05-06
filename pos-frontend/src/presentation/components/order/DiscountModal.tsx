import { useState } from 'react'
import { Modal } from '@presentation/components/ui/Modal'
import { Button } from '@presentation/components/ui/Button'
import { Input } from '@presentation/components/ui/Input'
import { Discount } from '@domain/value-objects/Discount'

interface DiscountModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (discount: Discount) => void
  targetLabel: string
}

export function DiscountModal({ isOpen, onClose, onApply, targetLabel }: DiscountModalProps) {
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleApply = () => {
    const num = parseFloat(value)
    if (isNaN(num) || num <= 0) {
      setError('Enter a valid positive number')
      return
    }
    if (type === 'percentage' && num > 100) {
      setError('Percentage cannot exceed 100%')
      return
    }
    const discount = type === 'percentage' ? Discount.percentage(num) : Discount.fixed(num)
    onApply(discount)
    setValue('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setValue('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Apply Discount — ${targetLabel}`} size="sm">
      <div className="discount-modal">
        <div className="discount-type-toggle">
          <button
            className={`toggle-btn ${type === 'percentage' ? 'active' : ''}`}
            onClick={() => setType('percentage')}
          >
            % Percentage
          </button>
          <button
            className={`toggle-btn ${type === 'fixed' ? 'active' : ''}`}
            onClick={() => setType('fixed')}
          >
            $ Fixed Amount
          </button>
        </div>

        <Input
          label={type === 'percentage' ? 'Discount (%)' : 'Discount ($)'}
          type="number"
          min="0"
          max={type === 'percentage' ? '100' : undefined}
          step="0.01"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError('') }}
          error={error}
          placeholder={type === 'percentage' ? 'e.g. 10' : 'e.g. 5.00'}
          autoFocus
        />

        <p className="discount-note">⚠️ Discounts over 20% require supervisor approval.</p>

        <div className="modal-footer">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleApply}>Apply Discount</Button>
        </div>
      </div>
    </Modal>
  )
}
