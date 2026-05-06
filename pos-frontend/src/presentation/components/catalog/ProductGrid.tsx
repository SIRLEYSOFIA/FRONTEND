import { ProductViewModel } from '@application/view-models/ProductViewModel'
import { ProductCard } from './ProductCard'
import { Spinner } from '@presentation/components/ui/Spinner'

interface ProductGridProps {
  products: ProductViewModel[]
  loading: boolean
  error: string | null
  onSelect: (product: ProductViewModel) => void
}

export function ProductGrid({ products, loading, error, onSelect }: ProductGridProps) {
  if (loading) {
    return (
      <div className="product-grid-state">
        <Spinner size="lg" label="Loading products..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-grid-state product-grid-error" role="alert">
        <span>⚠️</span>
        <p>{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-state" role="status">
        <span style={{ fontSize: '2rem' }}>🔍</span>
        <p>No products found</p>
      </div>
    )
  }

  return (
    <div
      className="product-grid"
      role="list"
      aria-label={`${products.length} products`}
    >
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} onSelect={onSelect} />
        </div>
      ))}
    </div>
  )
}
