import { Money } from '@domain/value-objects/Money'

export interface Product {
  id: string
  sku: string
  barcode: string
  name: string
  description: string
  price: Money
  taxRate: number // e.g. 0.19 for 19%
  categoryId: string
  imageUrl: string
  stock: number
  isActive: boolean
}

export interface ProductFilters {
  query?: string
  categoryId?: string
  inStockOnly?: boolean
}

/**
 * Creates a Product with validation.
 */
export function createProduct(data: {
  id: string
  sku: string
  barcode: string
  name: string
  description?: string
  price: Money
  taxRate?: number
  categoryId?: string
  imageUrl?: string
  stock?: number
  isActive?: boolean
}): Product {
  if (!data.id) throw new Error('Product id is required')
  if (!data.name) throw new Error('Product name is required')
  if (!data.sku) throw new Error('Product SKU is required')

  return {
    id: data.id,
    sku: data.sku,
    barcode: data.barcode,
    name: data.name,
    description: data.description ?? '',
    price: data.price,
    taxRate: data.taxRate ?? 0,
    categoryId: data.categoryId ?? 'uncategorized',
    imageUrl: data.imageUrl ?? '',
    stock: data.stock ?? 0,
    isActive: data.isActive ?? true,
  }
}
