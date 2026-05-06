import { IPrinterService, ReceiptData } from '@application/ports/services/IPrinterService'

export class MockPrinterService implements IPrinterService {
  private available = true

  async printReceipt(receipt: ReceiptData): Promise<void> {
    if (!this.available) throw new Error('Printer not available')
    console.log('🖨️ Printing receipt for order:', receipt.order.id)
    await delay(800)
  }

  async isAvailable(): Promise<boolean> {
    return this.available
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
