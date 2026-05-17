import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, deleteProduct } from '../../services/api'
import toast from 'react-hot-toast'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = () => {
    setLoading(true)
    fetchProducts()
      .then((res) => setProducts(res.data.data ?? res.data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    setDeleting(id)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      toast.success('Product deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-heading">Products</h1>
          <p className="text-text-muted text-sm mt-1">{products.length} products</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary">
          <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 neu-card">
          <span className="material-symbols-outlined text-6xl text-text-muted mb-4">inventory_2</span>
          <p className="text-text-muted">No products yet</p>
        </div>
      ) : (
        <div className="neu-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase text-text-muted tracking-wider border-b border-border-warm">
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Stock</th>
                <th className="pb-3 pr-4">Rating</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-warm">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-primary/5 transition">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://placehold.co/40x40/FAF0E6/FF6B6B?text=P'}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium truncate max-w-[200px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 capitalize text-text-body">{p.category}</td>
                  <td className="py-3 pr-4 font-medium">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td className="py-3 pr-4">
                    <span className={`font-medium ${p.stock === 0 ? 'text-error' : p.stock < 10 ? 'text-amber-600' : 'text-success'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-accent text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span>{p.averageRating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting === p._id}
                        className="p-2 rounded-lg hover:bg-error/10 text-error transition disabled:opacity-40"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
