/**
 * Dependency Injection Container
 * Wires ports to their concrete adapter implementations.
 * Swap any adapter here without touching use cases or UI.
 */
import { MockProductRepository, MOCK_CATEGORIES } from '@infrastructure/mock/MockProductRepository'
import { IndexedDBOrderRepository } from '@infrastructure/local/IndexedDBOrderRepository'
import { MockPaymentGateway } from '@infrastructure/mock/MockPaymentGateway'
import { MockAuthService } from '@infrastructure/mock/MockAuthService'
import { MockPrinterService } from '@infrastructure/mock/MockPrinterService'

import { SearchProducts } from '@application/use-cases/catalog/SearchProducts'
import { GetProductByBarcode } from '@application/use-cases/catalog/GetProductByBarcode'
import { AddItemToOrder } from '@application/use-cases/order/AddItemToOrder'
import { RemoveItemFromOrder } from '@application/use-cases/order/RemoveItemFromOrder'
import { ApplyDiscount } from '@application/use-cases/order/ApplyDiscount'
import { ConfirmOrder } from '@application/use-cases/order/ConfirmOrder'
import { ProcessPayment } from '@application/use-cases/payment/ProcessPayment'
import { ProcessMixedPayment } from '@application/use-cases/payment/ProcessMixedPayment'
import { OpenShift } from '@application/use-cases/session/OpenShift'
import { CloseShift } from '@application/use-cases/session/CloseShift'

// Adapters (singletons)
const productRepository = new MockProductRepository()
const orderRepository = new IndexedDBOrderRepository()
const paymentGateway = new MockPaymentGateway()
const authService = new MockAuthService()
const printerService = new MockPrinterService()

// Use Cases
export const container = {
  // Catalog
  searchProducts: new SearchProducts(productRepository),
  getProductByBarcode: new GetProductByBarcode(productRepository),

  // Order
  addItemToOrder: new AddItemToOrder(orderRepository),
  removeItemFromOrder: new RemoveItemFromOrder(orderRepository),
  applyDiscount: new ApplyDiscount(orderRepository),
  confirmOrder: new ConfirmOrder(orderRepository),

  // Payment
  processPayment: new ProcessPayment(paymentGateway, orderRepository),
  processMixedPayment: new ProcessMixedPayment(paymentGateway, orderRepository),

  // Session
  openShift: new OpenShift(authService),
  closeShift: new CloseShift(),

  // Services (direct access for hooks)
  authService,
  printerService,
  orderRepository,
  categories: MOCK_CATEGORIES,
}
