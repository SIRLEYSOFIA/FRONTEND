import { Order } from '@domain/entities/Order'
import { Button } from '@presentation/components/ui/Button'

interface OrderTabsProps {
  orders: Order[]
  activeOrderId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  maxOrders?: number
}

export function OrderTabs({ orders, activeOrderId, onSelect, onNew, maxOrders = 10 }: OrderTabsProps) {
  const draftOrders = orders.filter((o) => o.status === 'draft' || o.status === 'confirmed')

  return (
    <div className="order-tabs" role="tablist" aria-label="Active orders">
      {draftOrders.map((order, i) => (
        <button
          key={order.id}
          role="tab"
          aria-selected={order.id === activeOrderId}
          className={`order-tab ${order.id === activeOrderId ? 'active' : ''}`}
          onClick={() => onSelect(order.id)}
        >
          #{i + 1}
          {order.items.length > 0 && (
            <span className="order-tab__count">{order.items.reduce((a, item) => a + item.quantity, 0)}</span>
          )}
        </button>
      ))}
      {draftOrders.length < maxOrders && (
        <button
          className="order-tab order-tab--new"
          onClick={onNew}
          aria-label="New order"
          title="New order"
        >
          +
        </button>
      )}
    </div>
  )
}
