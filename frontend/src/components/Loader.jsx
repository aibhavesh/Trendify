export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-text-muted text-sm font-display">Loading…</p>
      </div>
    </div>
  )
}
