import { Order } from '@domain/entities/Order'
import { Payment } from '@domain/entities/Payment'
import { Button } from '@presentation/components/ui/Button'
import { COMPANY_NAME, COMPANY_TAX_ID } from '@shared/constants'

interface ReceiptPreviewProps {
  order: Order
  payment: Payment
  cashierName: string
  shiftId: string
  onPrint: () => void
  onEmail: () => void
  onWhatsApp: () => void
  onNewSale: () => void
}

export function ReceiptPreview({
  order,
  payment,
  cashierName,
  shiftId,
  onPrint,
  onEmail,
  onWhatsApp,
  onNewSale,
}: ReceiptPreviewProps) {
  const date = (payment.processedAt ?? new Date()).toLocaleString('en-US')

  return (
    <div className="receipt-wrapper">
      <div className="receipt-success-banner">
        <span className="receipt-check">✅</span>
        <h2>Payment Successful!</h2>
      </div>

      <div className="receipt" aria-label="Receipt">
        <div className="receipt__header">
          <h3>{COMPANY_NAME}</h3>
          <p>Tax ID: {COMPANY_TAX_ID}</p>
          <p>{date}</p>
          <p>Cashier: {cashierName} | Shift: {shiftId}</p>
        </div>

        <div className="receipt__divider" />

        <div className="receipt__items">
          {order.items.map((item) => (
            <div key={item.id} className="receipt__item">
              <span className="receipt__item-name">
                {item.productName}
                {!item.discount.isNone() && (
                  <span className="receipt__item-discount"> ({item.discount.toString()} off)</span>
                )}
              </span>
              <span className="receipt__item-qty">{item.quantity}x {item.unitPrice.format()}</span>
              <span className="receipt__item-total">{item.lineTotal.format()}</span>
            </div>
          ))}
        </div>

        <div className="receipt__divider" />

        <div className="receipt__totals">
          <div className="receipt__row">
            <span>Subtotal</span>
            <span>{order.subtotal.format()}</span>
          </div>
          <div className="receipt__row">
            <span>Tax</span>
            <span>{order.taxAmount.format()}</span>
          </div>
          {!order.orderDiscountAmount.isZero() && (
            <div className="receipt__row receipt__row--discount">
              <span>Discount</span>
              <span>-{order.orderDiscountAmount.format()}</span>
            </div>
          )}
          <div className="receipt__row receipt__row--total">
            <span>TOTAL</span>
            <span>{order.total.format()}</span>
          </div>
          {payment.method === 'cash' && (
            <>
              <div className="receipt__row">
                <span>Cash</span>
                <span>{payment.amountReceived.format()}</span>
              </div>
              <div className="receipt__row">
                <span>Change</span>
                <span>{payment.change.format()}</span>
              </div>
            </>
          )}
          <div className="receipt__row receipt__row--method">
            <span>Payment</span>
            <span className="receipt__method">{payment.method.toUpperCase()}</span>
          </div>
        </div>

        <div className="receipt__divider" />
        <p className="receipt__footer">Thank you for your purchase!</p>
        <p className="receipt__txn">Txn: {payment.transactionId.slice(0, 12)}...</p>
      </div>

      <div className="receipt__actions">
        <Button variant="secondary" size="sm" onClick={onPrint}>🖨️ Print</Button>
        <Button variant="secondary" size="sm" onClick={onEmail}>📧 Email</Button>
        <Button variant="secondary" size="sm" onClick={onWhatsApp}>📲 WhatsApp</Button>
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={onNewSale}>
        🛒 New Sale
      </Button>
    </div>
  )
}
