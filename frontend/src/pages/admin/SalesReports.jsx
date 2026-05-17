import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getSalesReport } from '../../services/api'

function toDateInputString(date) {
  return date.toISOString().slice(0, 10)
}

export default function SalesReports() {
  const [from, setFrom] = useState(() => {
    const start = new Date()
    start.setDate(start.getDate() - 29)
    return toDateInputString(start)
  })
  const [to, setTo] = useState(() => toDateInputString(new Date()))

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadReport = async (params) => {
    try {
      setLoading(true)
      const res = await getSalesReport(params)
      setReport(res.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load sales report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport({ from, to })
  }, [])

  const summaryCards = useMemo(() => {
    const summary = report?.summary || {}
    return [
      {
        label: 'Gross Sales',
        value: `₹${Number(summary.grossSales || 0).toLocaleString('en-IN')}`,
        icon: 'payments',
      },
      {
        label: 'Total Orders',
        value: Number(summary.totalOrders || 0).toLocaleString('en-IN'),
        icon: 'receipt_long',
      },
      {
        label: 'Paid Orders',
        value: Number(summary.paidOrders || 0).toLocaleString('en-IN'),
        icon: 'task_alt',
      },
      {
        label: 'Cancelled Orders',
        value: Number(summary.cancelledOrders || 0).toLocaleString('en-IN'),
        icon: 'cancel',
      },
    ]
  }, [report])

  const dailySales = report?.dailySales || []

  const maxSales = useMemo(() => {
    if (!dailySales.length) return 1
    return Math.max(...dailySales.map((item) => Number(item.totalSales || 0)), 1)
  }, [dailySales])

  const handleFilter = (event) => {
    event.preventDefault()
    if (!from || !to) {
      toast.error('Please select both date values')
      return
    }
    if (new Date(from) > new Date(to)) {
      toast.error('From date cannot be later than To date')
      return
    }
    loadReport({ from, to })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-heading">Sales Reports</h1>
        <p className="text-text-muted text-sm mt-1">Track revenue trends and order performance</p>
      </div>

      <div className="neu-card mb-8">
        <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="from-date" className="block text-sm font-medium mb-1">From</label>
            <input
              id="from-date"
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="neu-input"
            />
          </div>
          <div>
            <label htmlFor="to-date" className="block text-sm font-medium mb-1">To</label>
            <input
              id="to-date"
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="neu-input"
            />
          </div>
          <button type="submit" className="btn-primary">Apply</button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {summaryCards.map((card) => (
              <div key={card.label} className="neu-card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-text-muted">{card.label}</p>
                  <p className="font-display font-bold text-xl">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="neu-card">
            <h2 className="font-display font-bold text-lg mb-5">Daily Sales</h2>

            {dailySales.length === 0 ? (
              <div className="py-16 text-center text-text-muted">No sales data in selected range</div>
            ) : (
              <div className="space-y-3">
                {dailySales.map((item) => {
                  const year = item._id?.year || 0
                  const month = item._id?.month || 1
                  const day = item._id?.day || 1
                  const dateLabel = new Date(year, month - 1, day).toLocaleDateString('en-IN')
                  const sales = Number(item.totalSales || 0)
                  const percentage = Math.max(3, Math.round((sales / maxSales) * 100))

                  return (
                    <div key={`${year}-${month}-${day}`} className="grid grid-cols-[110px_1fr_180px] gap-3 items-center">
                      <span className="text-xs text-text-muted">{dateLabel}</span>
                      <div className="h-3 bg-linen rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-right text-sm">
                        <span className="font-semibold">₹{sales.toLocaleString('en-IN')}</span>
                        <span className="text-text-muted ml-3">{item.totalOrders || 0} orders</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
