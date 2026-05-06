import { OrderViewModel } from '@application/view-models/OrderViewModel'
import { Button } from '@presentation/components/ui/Button'

interface CartSummaryProps {
  order: OrderViewModel
  onCharge: () => void
  onDiscount: () => void
  onClear: () => void
}

export function CartSummary({ order, onCharge, onDiscount, onClear }: CartSummaryProps) {
  return (
    <div className="cart-summary">
      <div className="cart-summary__lines">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{order.subtotalFormatted}</span>
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <span>{order.taxFormatted}</span>
        </div>
        {order.hasOrderDiscount && (
          <div className="summary-row summary-row--discount">
            <span>Discount</span>
            <span>{order.orderDiscountFormatted}</span>
          </div>
        )}
        <div className="summary-row summary-row--total">
          <span>TOTAL</span>
          <span>{order.totalFormatted}</span>
        </div>
      </div>

      <div className="cart-summary__actions">
        <div className="cart-summary__secondary">
          <Button variant="ghost" size="sm" onClick={onDiscount} disabled={order.isEmpty}>
            🏷️ Discount
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear} disabled={order.isEmpty}>
            🗑️ Clear
          </Button>
        </div>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onCharge}
          disabled={order.isEmpty}
          aria-label={`Charge ${order.totalFormatted}`}
        >
          💳 Charge {order.totalFormatted}
        </Button>
      </div>
    </div>
  )
}
