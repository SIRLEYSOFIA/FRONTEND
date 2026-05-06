import { IProductRepository } from '@application/ports/repositories/IProductRepository'
import { Product } from '@domain/entities/Product'

export class GetProductByBarcode {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(barcode: string): Promise<Product | null> {
    if (!barcode || barcode.trim().length === 0) return null
    return this.productRepository.searchByBarcode(barcode.trim())
  }
}
