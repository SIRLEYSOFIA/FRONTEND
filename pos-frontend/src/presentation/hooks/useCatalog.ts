import { useState, useEffect, useCallback, useRef } from 'react'
import { container } from '@composition/container'
import { toProductViewModel, ProductViewModel } from '@application/view-models/ProductViewModel'
import { SEARCH_DEBOUNCE_MS } from '@shared/constants'

export function useCatalog() {
  const [products, setProducts] = useState<ProductViewModel[]>([])
  const [categories] = useState(container.categories)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchProducts = useCallback(async (q: string, categoryId: string | null) => {
    setLoading(true)
    setError(null)
    try {
      const results = await container.searchProducts.execute({
        query: q,
        categoryId: categoryId ?? undefined,
      })
      setProducts(results.map(toProductViewModel))
    } catch {
      setError('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(
      () => fetchProducts(query, selectedCategory),
      SEARCH_DEBOUNCE_MS,
    )
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, selectedCategory, fetchProducts])

  const searchByBarcode = useCallback(async (barcode: string): Promise<ProductViewModel | null> => {
    const product = await container.getProductByBarcode.execute(barcode)
    return product ? toProductViewModel(product) : null
  }, [])

  return {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    query,
    setQuery,
    loading,
    error,
    searchByBarcode,
  }
}
