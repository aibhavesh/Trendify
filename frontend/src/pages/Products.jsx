import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { filterProducts, fetchProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import { PRODUCT_CATEGORIES } from '../constants/categories'

const CATEGORIES = ['all', ...PRODUCT_CATEGORIES]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]
const PER_PAGE = 12

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('min') || ''
  const maxPrice = searchParams.get('max') || ''

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (category !== 'all') params.category = category
    if (sort === 'price_asc') params.sort = 'price_asc'
    else if (sort === 'price_desc') params.sort = 'price_desc'
    else params.sort = 'latest'
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice

    const fetcher = Object.keys(params).length > 1 ? filterProducts(params) : fetchProducts()
    fetcher
      .then((res) => setProducts(res.data.data ?? res.data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => {
        setLoading(false)
        setPage(1)
      })
  }, [category, sort, minPrice, maxPrice])

  const totalPages = Math.ceil(products.length / PER_PAGE)
  const paginated = useMemo(
    () => products.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [products, page]
  )

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value && value !== 'all') p.set(key, value)
    else p.delete(key)
    setSearchParams(p)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-heading">Products</h1>
        <p className="text-text-muted text-sm mt-1">{products.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="neu-card space-y-6 lg:sticky lg:top-24">
            {/* Categories */}
            <div>
              <h3 className="font-display font-semibold text-sm mb-3">Category</h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateParam('category', c)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      category === c
                        ? 'bg-primary/10 text-primary font-semibold shadow-neu-pressed'
                        : 'text-text-body hover:bg-primary/5'
                    }`}
                  >
                    {c === 'all' ? 'All Products' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <h3 className="font-display font-semibold text-sm mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('min', e.target.value)}
                  className="neu-input py-2 text-xs"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('max', e.target.value)}
                  className="neu-input py-2 text-xs"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-display font-semibold text-sm mb-3">Sort By</h3>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="neu-input py-2 text-xs"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-text-muted mb-4">inventory_2</span>
              <p className="text-text-muted font-display">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {paginated.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
