import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../../services/api'

const initialForm = {
  code: '',
  discountPercent: 10,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  expiresAt: '',
  isActive: true,
}

function toInputDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export default function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)

  const sortedCoupons = useMemo(() => {
    return [...coupons].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [coupons])

  const loadCoupons = async () => {
    try {
      setLoading(true)
      const res = await getCoupons()
      setCoupons(res.data?.data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.code.trim()) {
      toast.error('Coupon code is required')
      return
    }

    if (!form.expiresAt) {
      toast.error('Expiry date is required')
      return
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountPercent: Number(form.discountPercent),
      minOrderAmount: Number(form.minOrderAmount),
      maxDiscountAmount: Number(form.maxDiscountAmount),
      expiresAt: new Date(form.expiresAt).toISOString(),
      isActive: Boolean(form.isActive),
    }

    setSaving(true)
    try {
      if (editingId) {
        const res = await updateCoupon(editingId, payload)
        const updated = res.data?.data
        setCoupons((prev) => prev.map((coupon) => (coupon._id === editingId ? updated : coupon)))
        toast.success('Coupon updated')
      } else {
        const res = await createCoupon(payload)
        const created = res.data?.data
        if (created) {
          setCoupons((prev) => [created, ...prev])
        }
        toast.success('Coupon created')
      }
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save coupon')
    } finally {
      setSaving(false)
    }
  }

  const beginEdit = (coupon) => {
    setEditingId(coupon._id)
    setForm({
      code: coupon.code || '',
      discountPercent: coupon.discountPercent ?? 10,
      minOrderAmount: coupon.minOrderAmount ?? 0,
      maxDiscountAmount: coupon.maxDiscountAmount ?? 0,
      expiresAt: toInputDate(coupon.expiresAt),
      isActive: Boolean(coupon.isActive),
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return

    try {
      await deleteCoupon(id)
      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id))
      if (editingId === id) {
        resetForm()
      }
      toast.success('Coupon deleted')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete coupon')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-heading">Coupons</h1>
        <p className="text-text-muted text-sm mt-1">Create and manage discount campaigns</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 neu-card h-fit">
          <h2 className="font-display font-bold text-lg mb-4">
            {editingId ? 'Edit Coupon' : 'Add Coupon'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1">Coupon Code</label>
              <input
                id="code"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="WELCOME10"
                className="neu-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="discountPercent" className="block text-sm font-medium mb-1">Discount %</label>
                <input
                  id="discountPercent"
                  name="discountPercent"
                  type="number"
                  min="1"
                  max="90"
                  value={form.discountPercent}
                  onChange={handleChange}
                  className="neu-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium mb-1">Expires On</label>
                <input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  value={form.expiresAt}
                  onChange={handleChange}
                  className="neu-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="minOrderAmount" className="block text-sm font-medium mb-1">Min Order</label>
                <input
                  id="minOrderAmount"
                  name="minOrderAmount"
                  type="number"
                  min="0"
                  value={form.minOrderAmount}
                  onChange={handleChange}
                  className="neu-input"
                />
              </div>

              <div>
                <label htmlFor="maxDiscountAmount" className="block text-sm font-medium mb-1">Max Discount</label>
                <input
                  id="maxDiscountAmount"
                  name="maxDiscountAmount"
                  type="number"
                  min="0"
                  value={form.maxDiscountAmount}
                  onChange={handleChange}
                  className="neu-input"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="rounded"
              />
              Active coupon
            </label>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving...' : editingId ? 'Update Coupon' : 'Create Coupon'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="xl:col-span-2 neu-card overflow-x-auto">
          <h2 className="font-display font-bold text-lg mb-4">All Coupons</h2>
          {loading ? (
            <div className="py-14 text-center text-text-muted">Loading coupons...</div>
          ) : sortedCoupons.length === 0 ? (
            <div className="py-14 text-center text-text-muted">No coupons created yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border-warm">
                  <th className="pb-3 pr-3">Code</th>
                  <th className="pb-3 pr-3">Discount</th>
                  <th className="pb-3 pr-3">Min / Max</th>
                  <th className="pb-3 pr-3">Expiry</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm">
                {sortedCoupons.map((coupon) => {
                  const expired = new Date(coupon.expiresAt).getTime() < Date.now()
                  return (
                    <tr key={coupon._id} className="hover:bg-primary/5 transition">
                      <td className="py-3 pr-3 font-semibold">{coupon.code}</td>
                      <td className="py-3 pr-3">{coupon.discountPercent}%</td>
                      <td className="py-3 pr-3">
                        ₹{Number(coupon.minOrderAmount || 0).toLocaleString('en-IN')} / ₹
                        {Number(coupon.maxDiscountAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 pr-3">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                      <td className="py-3 pr-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            coupon.isActive && !expired
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {coupon.isActive && !expired ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => beginEdit(coupon)} className="btn-secondary text-xs">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(coupon._id)} className="btn-danger text-xs">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
