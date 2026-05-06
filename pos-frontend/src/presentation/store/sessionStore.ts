import { create } from 'zustand'
import { Session } from '@application/ports/services/IAuthService'
import { Shift } from '@application/use-cases/session/OpenShift'

interface SessionState {
  session: Session | null
  shift: Shift | null
  isLocked: boolean
  setSession: (session: Session | null) => void
  setShift: (shift: Shift | null) => void
  lock: () => void
  unlock: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  shift: null,
  isLocked: false,
  setSession: (session) => set({ session }),
  setShift: (shift) => set({ shift }),
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
}))
