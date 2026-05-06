import React, { useState, useEffect } from 'react'
import { useSessionStore } from '@presentation/store/sessionStore'
import { APP_NAME } from '@shared/constants'

interface POSHeaderProps {
  onLock: () => void
  onLogout: () => void
}

function useClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function POSHeader({ onLock, onLogout }: POSHeaderProps) {
  const { session, shift } = useSessionStore()
  const time = useClock()

  return (
    <header className="pos-header" role="banner">
      <div className="pos-header__brand">
        <span className="pos-header__logo">🛒</span>
        <span className="pos-header__name">{APP_NAME}</span>
      </div>

      <div className="pos-header__info">
        {session && (
          <span className="pos-header__cashier">
            👤 {session.username}
            <span className={`role-badge role-${session.role}`}>{session.role}</span>
          </span>
        )}
        {shift && (
          <span className="pos-header__shift">
            🏪 Shift #{shift.id.slice(0, 6)}
          </span>
        )}
        <span className="pos-header__time" aria-live="polite">{time}</span>
      </div>

      <div className="pos-header__actions">
        <button className="header-btn" onClick={onLock} aria-label="Lock screen" title="Lock">
          🔒
        </button>
        <button className="header-btn header-btn--danger" onClick={onLogout} aria-label="Logout" title="Logout">
          ⏻
        </button>
      </div>
    </header>
  )
}
