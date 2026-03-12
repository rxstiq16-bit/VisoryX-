export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page title skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-muted/50" />
          <div className="h-4 w-72 rounded-md bg-muted/30" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-muted/40" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/30 bg-card/50 p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-muted/40" />
              <div className="h-8 w-8 rounded-lg bg-muted/30" />
            </div>
            <div className="mt-3 h-7 w-16 rounded bg-muted/50" />
            <div className="mt-2 h-3 w-24 rounded bg-muted/20" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border/30 bg-card/50">
        <div className="border-b border-border/20 p-4">
          <div className="h-5 w-36 rounded bg-muted/40" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border/10 px-4 py-3.5">
            <div className="h-4 w-4 rounded bg-muted/30" />
            <div className="h-4 flex-1 rounded bg-muted/20" />
            <div className="h-4 w-24 rounded bg-muted/30" />
            <div className="h-6 w-16 rounded-full bg-muted/20" />
          </div>
        ))}
      </div>
    </div>
  )
}
