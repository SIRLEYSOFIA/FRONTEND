import { Shift } from './OpenShift'

export interface ShiftSummary {
  shift: Shift
  totalSales: number
  totalOrders: number
  salesByMethod: Record<string, number>
  expectedCash: number
  declaredCash: number
  cashDifference: number
}

export class CloseShift {
  async execute(
    shift: Shift,
    declaredCash: number,
    salesByMethod: Record<string, number>,
    totalOrders: number,
  ): Promise<ShiftSummary> {
    if (shift.status !== 'open') {
      throw new Error('Shift is already closed.')
    }

    const totalSales = Object.values(salesByMethod).reduce((a, b) => a + b, 0)
    const expectedCash = shift.openingCash + (salesByMethod['cash'] ?? 0)
    const cashDifference = declaredCash - expectedCash

    const closedShift: Shift = {
      ...shift,
      closedAt: new Date(),
      closingCash: declaredCash,
      status: 'closed',
    }

    return {
      shift: closedShift,
      totalSales,
      totalOrders,
      salesByMethod,
      expectedCash,
      declaredCash,
      cashDifference,
    }
  }
}
