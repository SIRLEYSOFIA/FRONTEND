import { useState } from 'react'
import { useSession } from '@presentation/hooks/useSession'
import { useSessionStore } from '@presentation/store/sessionStore'
import { Button } from '@presentation/components/ui/Button'

export function PinLockPage() {
  const { validatePin, logout } = useSession()
  const { session } = useSessionStore()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDigit = (d: string) => {
    if (pin.length < 4) setPin((p) => p + d)
  }

  const handleClear = () => { setPin(''); setError('') }

  const handleSubmit = async () => {
    if (pin.length !== 4) return
    setLoading(true)
    const valid = await validatePin(pin)
    setLoading(false)
    if (!valid) {
      setError('Incorrect PIN. Try again.')
      setPin('')
    }
  }

  return (
    <div className="auth-layout">
      <div className="pin-card">
        <div className="pin-card__header">
          <span className="pin-lock-icon">🔒</span>
          <h2>Screen Locked</h2>
          <p>Welcome back, <strong>{session?.username}</strong></p>
          <p className="pin-hint">Enter your 4-digit PIN to continue</p>
        </div>

        <div className="pin-dots" aria-label={`${pin.length} of 4 digits entered`}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
          ))}
        </div>

        {error && <p className="pin-error" role="alert">{error}</p>}

        <div className="numpad">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
            <button
              key={i}
              className={`numpad-key ${d === '' ? 'numpad-key--empty' : ''}`}
              onClick={() => {
                if (d === '⌫') setPin((p) => p.slice(0, -1))
                else if (d !== '') handleDigit(d)
              }}
              disabled={d === ''}
              aria-label={d === '⌫' ? 'Backspace' : d === '' ? '' : `Digit ${d}`}
            >
              {d}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSubmit}
          disabled={pin.length !== 4 || loading}
          loading={loading}
        >
          Unlock
        </Button>

        <button className="pin-logout-link" onClick={logout}>
          Sign in as different user
        </button>
      </div>
    </div>
  )
}
