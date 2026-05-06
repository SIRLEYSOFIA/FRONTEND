import { useCallback, useEffect } from 'react'
import { useOrderStore } from '@presentation/store/orderStore'
import { useSessionStore } from '@presentation/store/sessionStore'
import { useUIStore } from '@presentation/store/uiStore'
import { container } from '@composition/container'
import { ProductViewModel } from '@application/view-models/ProductViewModel'
import { toOrderViewModel } from '@application/view-models/OrderViewModel'
import { Discount } from '@domain/value-objects/Discount'
import { UserRole } from '@domain/value-objects/OrderStatus'

export function useOrder() {
  const { orders, activeOrderId, activeOrder, upsertOrder, removeOrder, newOrder, setOrders, setActiveOrderId } = useOrderStore()
  const { session, shift } = useSessionStore()
  const { addToast, openDiscountModal } = useUIStore()

  // Load persisted orders on mount
  useEffect(() => {
    container.orderRepository.getActive().then((loaded) => {
      if (loaded.length > 0) setOrders(loaded)
    })
  }, [setOrders])

  const ensureActiveOrder = useCallback(() => {
    if (activeOrder && activeOrder.status === 'draft') return activeOrder
    return newOrder(session?.userId ?? 'guest', shift?.id ?? 'no-shift')
  }, [activeOrder, newOrder, session, shift])

  const addProduct = useCallback(async (product: ProductViewModel) => {
    const order = ensureActiveOrder()
    // Fetch full domain product
    const domainProduct = await container.searchProducts.execute({ query: product.sku })
    const found = domainProduct.find((p) => p.id === product.id)
    if (!found) { addToast('Product not found', 'error'); return }
    try {
      const updated = await container.addItemToOrder.execute(order, found)
      upsertOrder(updated)
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Failed to add item', 'error')
    }
  }, [ensureActiveOrder, upsertOrder, addToast])

  const removeItem = useCallback(async (itemId: string) => {
    if (!activeOrder) return
    try {
      const updated = await container.removeItemFromOrder.execute(activeOrder, itemId)
      upsertOrder(updated)
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Failed to remove item', 'error')
    }
  }, [activeOrder, upsertOrder, addToast])

  const applyItemDiscount = useCallback(async (
    itemId: string,
    discount: Discount,
    userRole: UserRole,
  ) => {
    if (!activeOrder) return false
    try {
      const result = await container.applyDiscount.applyToItem(activeOrder, itemId, discount, userRole)
      if (result.requiresSupervisor) {
        addToast('Discount > 20% requires supervisor approval', 'warning')
        return false
      }
      upsertOrder(result.order)
      return true
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Failed to apply discount', 'error')
      return false
    }
  }, [activeOrder, upsertOrder, addToast])

  const applyOrderDiscount = useCallback(async (
    discount: Discount,
    userRole: UserRole,
  ) => {
    if (!activeOrder) return false
    try {
      const result = await container.applyDiscount.applyToOrder(activeOrder, discount, userRole)
      if (result.requiresSupervisor) {
        addToast('Discount > 20% requires supervisor approval', 'warning')
        return false
      }
      upsertOrder(result.order)
      return true
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Failed to apply discount', 'error')
      return false
    }
  }, [activeOrder, upsertOrder, addToast])

  const confirmOrder = useCallback(async () => {
    if (!activeOrder) return false
    try {
      const confirmed = await container.confirmOrder.execute(activeOrder)
      upsertOrder(confirmed)
      return true
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Cannot confirm order', 'error')
      return false
    }
  }, [activeOrder, upsertOrder, addToast])

  const createNewOrder = useCallback(() => {
    return newOrder(session?.userId ?? 'guest', shift?.id ?? 'no-shift')
  }, [newOrder, session, shift])

  const activeOrderVM = activeOrder ? toOrderViewModel(activeOrder) : null

  return {
    orders,
    activeOrderId,
    activeOrder,
    activeOrderVM,
    setActiveOrderId,
    addProduct,
    removeItem,
    applyItemDiscount,
    applyOrderDiscount,
    confirmOrder,
    createNewOrder,
    removeOrder,
  }
}
