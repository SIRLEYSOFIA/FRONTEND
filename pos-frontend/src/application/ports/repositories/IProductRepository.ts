import { Product, ProductFilters } from '@domain/entities/Product'

export interface IProductRepository {
  getAll(filters?: ProductFilters): Promise<Product[]>
  getById(id: string): Promise<Product | null>
  searchByQuery(query: string): Promise<Product[]>
  searchByBarcode(barcode: string): Promise<Product | null>
  getCategories(): Promise<string[]>
}
