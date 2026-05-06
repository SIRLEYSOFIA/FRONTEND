import { ProductViewModel } from '@application/view-models/ProductViewModel'

interface ProductCardProps {
  product: ProductViewModel
  onSelect: (product: ProductViewModel) => void
}

const CATEGORY_EMOJIS: Record<string, string> = {
  beverages: '🥤',
  snacks: '🍿',
  dairy: '🥛',
  bakery: '🍞',
  produce: '🥦',
  frozen: '🧊',
  cleaning: '🧹',
  personal: '🧴',
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const emoji = CATEGORY_EMOJIS[product.categoryId] ?? '📦'

  return (
    <button
      className={`product-card ${product.isOutOfStock ? 'product-card--out-of-stock' : ''}`}
      onClick={() => !product.isOutOfStock && onSelect(product)}
      disabled={product.isOutOfStock}
      aria-label={`Add ${product.name} to cart, ${product.priceFormatted}`}
      title={product.isOutOfStock ? 'Out of stock' : product.name}
    >
      <div className="product-card__image">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} loading="lazy" />
          : <span className="product-card__emoji">{emoji}</span>
        }
      </div>
      <div className="product-card__body">
        <p className="product-card__name">{product.name}</p>
        <p className="product-card__sku">{product.sku}</p>
        <p className="product-card__price">{product.priceFormatted}</p>
        <div className="product-card__stock">
          {product.isOutOfStock && <span className="stock-badge stock-out">Out of stock</span>}
          {product.isLowStock && !product.isOutOfStock && (
            <span className="stock-badge stock-low">Low: {product.stock}</span>
          )}
        </div>
      </div>
    </button>
  )
}
