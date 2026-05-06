import { useState, useCallback, useEffect, useRef } from 'react'
import { useSessionStore } from '@presentation/store/sessionStore'
import { container } from '@composition/container'
import { SESSION_TIMEOUT_MS } from '@shared/constants'

export function useSession() {
  const { session, shift, isLocked, setSession, setShift, lock, unlock } = useSessionStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => lock(), SESSION_TIMEOUT_MS)
  }, [lock])

  useEffect(() => {
    if (!session || isLocked) return
    const events = ['mousemove', 'keydown', 'click', 'touchstart']
    events.forEach((e) => window.addEventListener(e, resetTimeout))
    resetTimeout()
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimeout))
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [session, isLocked, resetTimeout])

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const s = await container.authService.login({ username, password })
      setSession(s)
      return s
    } catch {
      setError('Invalid credentials. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [setSession])

  const logout = useCallback(async () => {
    await container.authService.logout()
    setSession(null)
    setShift(null)
  }, [setSession, setShift])

  const validatePin = useCallback(async (pin: string): Promise<boolean> => {
    const valid = await container.authService.validatePin(pin)
    if (valid) unlock()
    return valid
  }, [unlock])

  const openShift = useCallback(async (openingCash: number) => {
    const s = await container.openShift.execute(openingCash)
    setShift(s)
    return s
  }, [setShift])

  return { session, shift, isLocked, loading, error, login, logout, validatePin, openShift }
}
