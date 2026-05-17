export default function StatusBadge({ status }) {
  const map = {
    processing: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
    shipped: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    paid: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    refunded: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
    success: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  }

  const style = map[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  )
}
