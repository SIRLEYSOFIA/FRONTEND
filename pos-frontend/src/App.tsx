import { useSessionStore } from '@presentation/store/sessionStore'
import { LoginPage } from '@presentation/pages/LoginPage'
import { PinLockPage } from '@presentation/pages/PinLockPage'
import { OpenShiftPage } from '@presentation/pages/OpenShiftPage'
import { POSPage } from '@presentation/pages/POSPage'

export default function App() {
  const { session, shift, isLocked } = useSessionStore()

  // 1. Not logged in → Login
  if (!session) return <LoginPage />

  // 2. Logged in but screen locked → PIN
  if (isLocked) return <PinLockPage />

  // 3. Logged in, no shift → Open shift
  if (!shift) return <OpenShiftPage />

  // 4. All good → POS
  return <POSPage />
}
