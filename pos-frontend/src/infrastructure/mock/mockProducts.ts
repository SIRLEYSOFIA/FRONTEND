import { Product } from '@domain/entities/Product'
import { Money } from '@domain/value-objects/Money'

export const MOCK_CATEGORIES = [
  { id: 'beverages', name: 'Beverages' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'produce', name: 'Produce' },
  { id: 'frozen', name: 'Frozen' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'personal', name: 'Personal Care' },
]

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p001', sku: 'BEV-001', barcode: '7501234567890', name: 'Coca-Cola 2L', description: 'Sparkling soft drink', price: Money.fromAmount(2.49), taxRate: 0.08, categoryId: 'beverages', imageUrl: '', stock: 48, isActive: true },
  { id: 'p002', sku: 'BEV-002', barcode: '7501234567891', name: 'Orange Juice 1L', description: 'Fresh squeezed orange juice', price: Money.fromAmount(3.99), taxRate: 0.08, categoryId: 'beverages', imageUrl: '', stock: 24, isActive: true },
  { id: 'p003', sku: 'BEV-003', barcode: '7501234567892', name: 'Mineral Water 500ml', description: 'Natural spring water', price: Money.fromAmount(0.99), taxRate: 0.08, categoryId: 'beverages', imageUrl: '', stock: 120, isActive: true },
  { id: 'p004', sku: 'BEV-004', barcode: '7501234567893', name: 'Coffee Blend 250g', description: 'Premium ground coffee', price: Money.fromAmount(6.49), taxRate: 0.08, categoryId: 'beverages', imageUrl: '', stock: 15, isActive: true },
  { id: 'p005', sku: 'SNK-001', barcode: '7501234567894', name: 'Potato Chips 150g', description: 'Classic salted chips', price: Money.fromAmount(1.79), taxRate: 0.08, categoryId: 'snacks', imageUrl: '', stock: 60, isActive: true },
  { id: 'p006', sku: 'SNK-002', barcode: '7501234567895', name: 'Chocolate Bar 100g', description: 'Milk chocolate', price: Money.fromAmount(1.49), taxRate: 0.08, categoryId: 'snacks', imageUrl: '', stock: 80, isActive: true },
  { id: 'p007', sku: 'SNK-003', barcode: '7501234567896', name: 'Mixed Nuts 200g', description: 'Roasted mixed nuts', price: Money.fromAmount(4.99), taxRate: 0.08, categoryId: 'snacks', imageUrl: '', stock: 3, isActive: true },
  { id: 'p008', sku: 'SNK-004', barcode: '7501234567897', name: 'Crackers 250g', description: 'Whole wheat crackers', price: Money.fromAmount(2.29), taxRate: 0.08, categoryId: 'snacks', imageUrl: '', stock: 35, isActive: true },
  { id: 'p009', sku: 'DAI-001', barcode: '7501234567898', name: 'Whole Milk 1L', description: 'Fresh whole milk', price: Money.fromAmount(1.29), taxRate: 0.00, categoryId: 'dairy', imageUrl: '', stock: 40, isActive: true },
  { id: 'p010', sku: 'DAI-002', barcode: '7501234567899', name: 'Cheddar Cheese 200g', description: 'Aged cheddar cheese', price: Money.fromAmount(3.49), taxRate: 0.00, categoryId: 'dairy', imageUrl: '', stock: 20, isActive: true },
  { id: 'p011', sku: 'DAI-003', barcode: '7501234567900', name: 'Greek Yogurt 500g', description: 'Plain Greek yogurt', price: Money.fromAmount(2.99), taxRate: 0.00, categoryId: 'dairy', imageUrl: '', stock: 18, isActive: true },
  { id: 'p012', sku: 'DAI-004', barcode: '7501234567901', name: 'Butter 250g', description: 'Unsalted butter', price: Money.fromAmount(2.79), taxRate: 0.00, categoryId: 'dairy', imageUrl: '', stock: 0, isActive: true },
  { id: 'p013', sku: 'BAK-001', barcode: '7501234567902', name: 'White Bread 500g', description: 'Sliced white bread', price: Money.fromAmount(1.99), taxRate: 0.00, categoryId: 'bakery', imageUrl: '', stock: 25, isActive: true },
  { id: 'p014', sku: 'BAK-002', barcode: '7501234567903', name: 'Whole Wheat Bread', description: 'Sliced whole wheat', price: Money.fromAmount(2.49), taxRate: 0.00, categoryId: 'bakery', imageUrl: '', stock: 12, isActive: true },
  { id: 'p015', sku: 'PRD-001', barcode: '7501234567904', name: 'Bananas 1kg', description: 'Fresh bananas', price: Money.fromAmount(0.89), taxRate: 0.00, categoryId: 'produce', imageUrl: '', stock: 50, isActive: true },
  { id: 'p016', sku: 'PRD-002', barcode: '7501234567905', name: 'Apples 1kg', description: 'Red delicious apples', price: Money.fromAmount(1.99), taxRate: 0.00, categoryId: 'produce', imageUrl: '', stock: 30, isActive: true },
  { id: 'p017', sku: 'FRZ-001', barcode: '7501234567906', name: 'Frozen Pizza 400g', description: 'Margherita pizza', price: Money.fromAmount(4.49), taxRate: 0.08, categoryId: 'frozen', imageUrl: '', stock: 15, isActive: true },
  { id: 'p018', sku: 'CLN-001', barcode: '7501234567907', name: 'Dish Soap 500ml', description: 'Lemon dish soap', price: Money.fromAmount(1.99), taxRate: 0.08, categoryId: 'cleaning', imageUrl: '', stock: 40, isActive: true },
  { id: 'p019', sku: 'PRS-001', barcode: '7501234567908', name: 'Shampoo 400ml', description: 'Moisturizing shampoo', price: Money.fromAmount(3.99), taxRate: 0.08, categoryId: 'personal', imageUrl: '', stock: 22, isActive: true },
  { id: 'p020', sku: 'BEV-005', barcode: '7501234567909', name: 'Green Tea 20 bags', description: 'Organic green tea', price: Money.fromAmount(2.99), taxRate: 0.08, categoryId: 'beverages', imageUrl: '', stock: 4, isActive: true },
]
