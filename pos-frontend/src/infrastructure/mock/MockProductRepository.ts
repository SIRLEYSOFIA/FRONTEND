import { IProductRepository } from '@application/ports/repositories/IProductRepository'
import { Product, ProductFilters } from '@domain/entities/Product'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from './mockProducts'

export class MockProductRepository implements IProductRepository {
  private products: Product[] = [...MOCK_PRODUCTS]

  async getAll(filters?: ProductFilters): Promise<Product[]> {
    let results = this.products.filter((p) => p.isActive)
    if (filters?.categoryId) {
      results = results.filter((p) => p.categoryId === filters.categoryId)
    }
    if (filters?.inStockOnly) {
      results = results.filter((p) => p.stock > 0)
    }
    return results
  }

  async getById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) ?? null
  }

  async searchByQuery(query: string): Promise<Product[]> {
    const q = query.toLowerCase()
    return this.products.filter(
      (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.description.toLowerCase().includes(q)),
    )
  }

  async searchByBarcode(barcode: string): Promise<Product | null> {
    return this.products.find((p) => p.barcode === barcode) ?? null
  }

  async getCategories(): Promise<string[]> {
    return MOCK_CATEGORIES.map((c) => c.id)
  }
}

export { MOCK_CATEGORIES }
