import { IProductRepository } from '@application/ports/repositories/IProductRepository'
import { Product, ProductFilters } from '@domain/entities/Product'

export class SearchProducts {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(filters: ProductFilters): Promise<Product[]> {
    if (filters.query && filters.query.trim().length > 0) {
      return this.productRepository.searchByQuery(filters.query.trim())
    }
    return this.productRepository.getAll(filters)
  }
}
