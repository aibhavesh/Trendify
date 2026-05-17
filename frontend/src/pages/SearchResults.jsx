import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchProducts } from '../services/api'
import ProductCard from '../components/ProductCard'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    searchProducts(query)
      .then((res) => setProducts(res.data.data ?? res.data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-3xl text-text-heading mb-2">
        Search Results
      </h1>
      <p className="text-text-muted text-sm mb-8">
        {loading ? 'Searching…' : `${products.length} results for "${query}"`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-text-muted mb-4">search_off</span>
          <p className="text-text-muted font-display">No products found for &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
