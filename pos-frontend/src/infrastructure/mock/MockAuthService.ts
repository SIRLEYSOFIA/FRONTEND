import { IAuthService, Credentials, Session } from '@application/ports/services/IAuthService'

const MOCK_USERS = [
  { username: 'cashier', password: '1234', role: 'cashier' as const, pin: '0000' },
  { username: 'supervisor', password: '1234', role: 'supervisor' as const, pin: '9999' },
  { username: 'admin', password: '1234', role: 'admin' as const, pin: '1111' },
]

export class MockAuthService implements IAuthService {
  private currentSession: Session | null = null

  async login(credentials: Credentials): Promise<Session> {
    await delay(500)
    const user = MOCK_USERS.find(
      (u) => u.username === credentials.username && u.password === credentials.password,
    )
    if (!user) throw new Error('Invalid credentials')

    const session: Session = {
      userId: `user-${user.username}`,
      username: user.username,
      role: user.role,
      token: `mock-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    }
    this.currentSession = session
    return session
  }

  async logout(): Promise<void> {
    this.currentSession = null
  }

  getCurrentSession(): Session | null {
    return this.currentSession
  }

  async validatePin(pin: string): Promise<boolean> {
    if (!this.currentSession) return false
    const user = MOCK_USERS.find((u) => u.username === this.currentSession!.username)
    return user?.pin === pin
  }

  async refreshToken(): Promise<Session> {
    if (!this.currentSession) throw new Error('No active session')
    return this.currentSession
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
