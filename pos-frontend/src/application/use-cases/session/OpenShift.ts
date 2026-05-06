import { IAuthService } from '@application/ports/services/IAuthService'
import { generateId } from '@shared/utils/generateId'

export interface Shift {
  id: string
  cashierId: string
  cashierName: string
  openedAt: Date
  closedAt: Date | null
  openingCash: number
  closingCash: number | null
  status: 'open' | 'closed'
}

export class OpenShift {
  constructor(private readonly authService: IAuthService) {}

  async execute(openingCash: number): Promise<Shift> {
    const session = this.authService.getCurrentSession()
    if (!session) throw new Error('No active session. Please log in first.')

    return {
      id: generateId(),
      cashierId: session.userId,
      cashierName: session.username,
      openedAt: new Date(),
      closedAt: null,
      openingCash,
      closingCash: null,
      status: 'open',
    }
  }
}
