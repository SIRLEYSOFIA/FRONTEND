import { Order } from '@domain/entities/Order'
import { Payment } from '@domain/entities/Payment'

export interface ReceiptData {
  order: Order
  payment: Payment
  cashierName: string
  shiftId: string
  companyName: string
  companyTaxId: string
}

export interface IPrinterService {
  printReceipt(receipt: ReceiptData): Promise<void>
  isAvailable(): Promise<boolean>
}
