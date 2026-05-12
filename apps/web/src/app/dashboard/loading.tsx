// Shown instantly while any dashboard page loads its JS chunk
export default function DashboardLoading() {
  return (
    <div className="flex flex-1">
      {/* Sidebar skeleton */}
      <div className="w-64 shrink-0 border-r bg-muted/20 animate-pulse">
        <div className="p-4 border-b">
          <div className="h-4 bg-muted rounded w-24 mb-3" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-muted" />
            <div className="space-y-1.5">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-2.5 bg-muted rounded w-28" />
            </div>
          </div>
        </div>
        <div className="p-3 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className="h-4 w-4 rounded bg-muted" />
              <div className="h-3 bg-muted rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <main className="flex-1 p-6 space-y-6">
        <div className="h-7 bg-muted rounded w-48 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
        <div className="h-48 bg-muted rounded-xl animate-pulse" />
      </main>
    </div>
  )
}
