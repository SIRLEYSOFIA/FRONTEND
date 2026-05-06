import { UserRole } from '@domain/value-objects/OrderStatus'

export interface Credentials {
  username: string
  password: string
}

export interface Session {
  userId: string
  username: string
  role: UserRole
  token: string
  expiresAt: Date
}

export interface IAuthService {
  login(credentials: Credentials): Promise<Session>
  logout(): Promise<void>
  getCurrentSession(): Session | null
  validatePin(pin: string): Promise<boolean>
  refreshToken(): Promise<Session>
}
