// Shown instantly while the home/category pages load
export default function PublicLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="min-h-[85vh] bg-gradient-to-b from-slate-950 to-slate-900" />
    </div>
  )
}
