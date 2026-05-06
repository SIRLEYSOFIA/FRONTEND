import { Product } from '@domain/entities/Product'

export interface ProductViewModel {
  id: string
  sku: string
  barcode: string
  name: string
  description: string
  priceFormatted: string
  priceAmount: number
  taxRate: number
  categoryId: string
  imageUrl: string
  stock: number
  isActive: boolean
  isLowStock: boolean
  isOutOfStock: boolean
}

const LOW_STOCK_THRESHOLD = 5

export function toProductViewModel(product: Product): ProductViewModel {
  return {
    id: product.id,
    sku: product.sku,
    barcode: product.barcode,
    name: product.name,
    description: product.description,
    priceFormatted: product.price.format(),
    priceAmount: product.price.toAmount(),
    taxRate: product.taxRate,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl,
    stock: product.stock,
    isActive: product.isActive,
    isLowStock: product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD,
    isOutOfStock: product.stock === 0,
  }
}
