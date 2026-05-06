import { OrderItemViewModel } from '@application/view-models/OrderViewModel'
import { Button } from '@presentation/components/ui/Button'

interface CartItemProps {
  item: OrderItemViewModel
  onIncrease: (itemId: string) => void
  onDecrease: (itemId: string) => void
  onRemove: (itemId: string) => void
  onDiscount: (itemId: string) => void
}

export function CartItem({ item, onIncrease, onDecrease, onRemove, onDiscount }: CartItemProps) {
  return (
    <div className="cart-item" role="row">
      <div className="cart-item__info">
        <p className="cart-item__name">{item.productName}</p>
        <p className="cart-item__sku">{item.productSku}</p>
        {item.hasDiscount && (
          <span className="cart-item__discount">🏷️ {item.discountLabel} off</span>
        )}
      </div>

      <div className="cart-item__qty">
        <button
          className="qty-btn"
          onClick={() => item.quantity > 1 ? onDecrease(item.id) : onRemove(item.id)}
          aria-label={`Decrease quantity of ${item.productName}`}
        >
          −
        </button>
        <span className="qty-value" aria-label={`Quantity: ${item.quantity}`}>
          {item.quantity}
        </span>
        <button
          className="qty-btn"
          onClick={() => onIncrease(item.id)}
          aria-label={`Increase quantity of ${item.productName}`}
        >
          +
        </button>
      </div>

      <div className="cart-item__price">
        <p className="cart-item__unit">{item.unitPriceFormatted} ea</p>
        <p className="cart-item__total">{item.lineTotalFormatted}</p>
      </div>

      <div className="cart-item__actions">
        <button
          className="icon-btn"
          onClick={() => onDiscount(item.id)}
          aria-label={`Apply discount to ${item.productName}`}
          title="Apply discount"
        >
          🏷️
        </button>
        <button
          className="icon-btn icon-btn--danger"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.productName} from cart`}
          title="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
