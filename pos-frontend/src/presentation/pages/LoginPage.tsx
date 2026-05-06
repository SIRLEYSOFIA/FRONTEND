import React, { useState } from 'react'
import { useSession } from '@presentation/hooks/useSession'
import { Button } from '@presentation/components/ui/Button'
import { Input } from '@presentation/components/ui/Input'
import { APP_NAME } from '@shared/constants'

export function LoginPage() {
  const { login, loading, error } = useSession()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(username, password)
  }

  return (
    <div className="auth-layout">
      <div className="login-card">
        <div className="login-card__header">
          <span className="login-logo">🛒</span>
          <h1 className="login-title">{APP_NAME}</h1>
          <p className="login-subtitle">Point of Sale System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="cashier / supervisor / admin"
            autoComplete="username"
            autoFocus
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (1234)"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="login-error" role="alert">
              ❌ {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!username || !password}
          >
            Sign In
          </Button>
        </form>

        <p className="login-hint">
          Demo: <strong>cashier / 1234</strong> · supervisor / 1234 · admin / 1234
        </p>
      </div>
    </div>
  )
}
