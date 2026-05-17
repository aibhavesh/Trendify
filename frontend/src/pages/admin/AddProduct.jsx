import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createProduct, uploadImage } from '../../services/api'
import { PRODUCT_CATEGORIES } from '../../constants/categories'
import toast from 'react-hot-toast'

export default function AddProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: PRODUCT_CATEGORIES[0] || 'Kurti',
    stock: '',
    tags: '',
    images: [],
    isTrending: false,
    isNewArrival: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await uploadImage(fd)
      setForm((prev) => ({ ...prev, images: [...prev.images, data.url || data.image] }))
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }
      await createProduct(payload)
      toast.success('Product created!')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link to="/admin/products" className="hover:text-primary transition">Products</Link>
        <span>/</span>
        <span className="text-text-heading font-medium">Add Product</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-text-heading">Add Product</h1>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-secondary">Cancel</Link>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? 'Creating…' : 'Create Product'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Product details */}
            <div className="neu-card space-y-5">
              <h2 className="font-display font-bold text-lg">Product Details</h2>
              <div>
                <label className="block text-sm font-medium text-text-body mb-1.5">Title</label>
                <input name="title" value={form.title} onChange={handleChange} required className="neu-input" placeholder="Product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-body mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="neu-input" placeholder="Product description" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-body mb-1.5">Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange} className="neu-input" placeholder="casual, cotton, summer" />
              </div>
            </div>

            {/* Pricing */}
            <div className="neu-card space-y-5">
              <h2 className="font-display font-bold text-lg">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-body mb-1.5">Price (₹)</label>
                  <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required className="neu-input" placeholder="999" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-body mb-1.5">Stock</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className="neu-input" placeholder="50" />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="neu-card">
              <h2 className="font-display font-bold text-lg mb-4">Media</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-linen">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-border-warm flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-text-muted text-[28px]">add_photo_alternate</span>
                      <span className="text-xs text-text-muted mt-1">Upload</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="neu-card space-y-5">
              <h2 className="font-display font-bold text-lg">Organization</h2>
              <div>
                <label className="block text-sm font-medium text-text-body mb-1.5">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="neu-input">
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isTrending" checked={form.isTrending} onChange={handleChange} className="accent-primary w-4 h-4" />
                <span className="text-sm font-medium">Mark as Trending</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} className="accent-primary w-4 h-4" />
                <span className="text-sm font-medium">Mark as New Arrival</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
