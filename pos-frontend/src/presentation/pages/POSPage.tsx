import { useCallback } from 'react'
import { useCatalog } from '@presentation/hooks/useCatalog'
import { useOrder } from '@presentation/hooks/useOrder'
import { useSession } from '@presentation/hooks/useSession'
import { useUIStore } from '@presentation/store/uiStore'
import { useOrderStore } from '@presentation/store/orderStore'
import { useSessionStore } from '@presentation/store/sessionStore'
import { container } from '@composition/container'
import { recalculateOrder } from '@domain/entities/Order'
import { updateOrderItemQuantity } from '@domain/entities/OrderItem'

import { POSHeader } from '@presentation/components/layout/POSHeader'
import { SearchBar } from '@presentation/components/catalog/SearchBar'
import { CategoryFilter } from '@presentation/components/catalog/CategoryFilter'
import { ProductGrid } from '@presentation/components/catalog/ProductGrid'
import { CartItem } from '@presentation/components/order/CartItem'
import { CartSummary } from '@presentation/components/order/CartSummary'
import { OrderTabs } from '@presentation/components/order/OrderTabs'
import { DiscountModal } from '@presentation/components/order/DiscountModal'
import { PaymentModal } from '@presentation/components/payment/PaymentModal'
import { ReceiptPreview } from '@presentation/components/receipt/ReceiptPreview'
import { ToastContainer } from '@presentation/components/ui/Toast'

import { ProductViewModel } from '@application/view-models/ProductViewModel'
import { Discount } from '@domain/value-objects/Discount'

export function POSPage() {
  const { logout } = useSession()
  const { lock } = useSessionStore()
  const { session, shift } = useSessionStore()

  const {
    products, categories, selectedCategory, setSelectedCategory,
    query, setQuery, loading, error, searchByBarcode,
  } = useCatalog()

  const {
    orders, activeOrderId, activeOrder, activeOrderVM,
    setActiveOrderId, addProduct, removeItem,
    applyItemDiscount, applyOrderDiscount, confirmOrder,
    createNewOrder,
  } = useOrder()

  const {
    isPaymentModalOpen, isDiscountModalOpen, discountTargetItemId,
    completedPayment,
    openPaymentModal, closePaymentModal,
    openDiscountModal, closeDiscountModal,
    setCompletedPayment,
  } = useUIStore()

  // Handle barcode scan
  const handleBarcode = useCallback(async (barcode: string) => {
    const product = await searchByBarcode(barcode)
    if (product) await addProduct(product)
  }, [searchByBarcode, addProduct])

  // Handle product selection from grid
  const handleProductSelect = useCallback(async (product: ProductViewModel) => {
    await addProduct(product)
  }, [addProduct])

  // Increase quantity
  const handleIncrease = useCallback(async (itemId: string) => {
    if (!activeOrder) return
    const item = activeOrder.items.find((i) => i.id === itemId)
    if (!item) return
    const updatedItems = activeOrder.items.map((i) =>
      i.id === itemId ? updateOrderItemQuantity(i, i.quantity + 1) : i
    )
    const updated = recalculateOrder({ ...activeOrder, items: updatedItems })
    useOrderStore.getState().upsertOrder(updated)
    await container.orderRepository.save(updated)
  }, [activeOrder])

  // Decrease quantity
  const handleDecrease = useCallback(async (itemId: string) => {
    if (!activeOrder) return
    const item = activeOrder.items.find((i) => i.id === itemId)
    if (!item) return
    if (item.quantity <= 1) {
      await removeItem(itemId)
      return
    }
    const updatedItems = activeOrder.items.map((i) =>
      i.id === itemId ? updateOrderItemQuantity(i, i.quantity - 1) : i
    )
    const updated = recalculateOrder({ ...activeOrder, items: updatedItems })
    useOrderStore.getState().upsertOrder(updated)
    await container.orderRepository.save(updated)
  }, [activeOrder, removeItem])

  // Handle charge button — confirm then open payment
  const handleCharge = useCallback(async () => {
    if (!activeOrderVM) return
    if (activeOrderVM.canBeConfirmed) {
      const ok = await confirmOrder()
      if (!ok) return
    }
    openPaymentModal()
  }, [activeOrderVM, confirmOrder, openPaymentModal])

  // Handle discount apply
  const handleDiscountApply = useCallback(async (discount: Discount) => {
    const role = session?.role ?? 'cashier'
    if (discountTargetItemId) {
      await applyItemDiscount(discountTargetItemId, discount, role)
    } else {
      await applyOrderDiscount(discount, role)
    }
  }, [discountTargetItemId, applyItemDiscount, applyOrderDiscount, session])

  // Clear all items from active order
  const handleClear = useCallback(async () => {
    if (!activeOrder) return
    for (const item of activeOrder.items) {
      await removeItem(item.id)
    }
  }, [activeOrder, removeItem])

  // New sale after receipt
  const handleNewSale = useCallback(() => {
    setCompletedPayment(null)
    createNewOrder()
  }, [setCompletedPayment, createNewOrder])

  // Show receipt after successful payment
  if (completedPayment && activeOrder) {
    return (
      <div className="pos-layout">
        <POSHeader onLock={lock} onLogout={logout} />
        <main className="pos-receipt-view">
          <ReceiptPreview
            order={activeOrder}
            payment={completedPayment}
            cashierName={session?.username ?? 'Cashier'}
            shiftId={shift?.id.slice(0, 8) ?? '—'}
            onPrint={() => window.print()}
            onEmail={() => alert('Email receipt — coming soon')}
            onWhatsApp={() => {
              const text = encodeURIComponent(
                `Receipt: ${activeOrder.total.format()} — Thank you for shopping with us!`
              )
              window.open(`https://wa.me/?text=${text}`, '_blank')
            }}
            onNewSale={handleNewSale}
          />
        </main>
        <ToastContainer />
      </div>
    )
  }

  const discountLabel = discountTargetItemId
    ? (activeOrderVM?.items.find((i) => i.id === discountTargetItemId)?.productName ?? 'Item')
    : 'Entire Order'

  return (
    <div className="pos-layout">
      <POSHeader onLock={lock} onLogout={logout} />

      <main className="pos-main">
        {/* LEFT: Catalog */}
        <section className="pos-catalog" aria-label="Product catalog">
          <div className="catalog-search">
            <SearchBar
              value={query}
              onChange={setQuery}
              onBarcodeScanned={handleBarcode}
            />
          </div>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <div className="catalog-grid-wrapper">
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onSelect={handleProductSelect}
            />
          </div>
        </section>

        {/* RIGHT: Cart */}
        <section className="pos-cart" aria-label="Shopping cart">
          <div className="cart-header">
            <h2 className="cart-title">
              🛒 Order
              {activeOrderVM && !activeOrderVM.isEmpty && (
                <span className="cart-count">{activeOrderVM.itemCount} items</span>
              )}
            </h2>
            <OrderTabs
              orders={orders}
              activeOrderId={activeOrderId}
              onSelect={setActiveOrderId}
              onNew={createNewOrder}
            />
          </div>

          <div className="cart-items" role="table" aria-label="Cart items">
            {!activeOrderVM || activeOrderVM.isEmpty ? (
              <div className="cart-empty">
                <span>🛒</span>
                <p>Cart is empty</p>
                <p className="cart-empty-hint">Select products from the catalog</p>
              </div>
            ) : (
              activeOrderVM.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={removeItem}
                  onDiscount={(id) => openDiscountModal(id)}
                />
              ))
            )}
          </div>

          {activeOrderVM && (
            <CartSummary
              order={activeOrderVM}
              onCharge={handleCharge}
              onDiscount={() => openDiscountModal()}
              onClear={handleClear}
            />
          )}
        </section>
      </main>

      {/* Modals */}
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={closeDiscountModal}
        onApply={handleDiscountApply}
        targetLabel={discountLabel}
      />

      {activeOrderVM && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          totalAmount={activeOrderVM.totalAmount}
          totalFormatted={activeOrderVM.totalFormatted}
        />
      )}

      <ToastContainer />
    </div>
  )
}
