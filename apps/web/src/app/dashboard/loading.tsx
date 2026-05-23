// Shown instantly while any dashboard page loads its JS chunk
export default function DashboardLoading() {
  return (
    <div className="flex flex-1">
      {/* Sidebar skeleton — desktop only */}
      <div className="hidden lg:block w-64 shrink-0 border-r bg-muted/20">
        <div className="p-4 border-b">
          <div className="h-4 bg-muted rounded-lg w-24 mb-3 shimmer" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-muted shimmer" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-muted rounded-lg w-20 shimmer" />
              <div className="h-2.5 bg-muted rounded-lg w-28 shimmer" />
            </div>
          </div>
        </div>
        <div className="p-3 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className="h-4 w-4 rounded-lg bg-muted shimmer" />
              <div className="h-3 bg-muted rounded-lg flex-1 shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <main className="flex-1 p-4 md:p-6 space-y-5">
        <div className="h-7 bg-muted rounded-xl w-48 shimmer" />
        <div className="h-3 bg-muted rounded-lg w-64 shimmer" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl shimmer" />
          ))}
        </div>
        <div className="h-56 bg-muted rounded-xl shimmer" />
        <div className="h-40 bg-muted rounded-xl shimmer" />
      </main>
    </div>
  )
}
