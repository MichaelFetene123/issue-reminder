import { Skeleton } from '@/components/ui/skeleton'

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-10" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border">
          <Skeleton className="col-span-5 h-3 w-10" />
          <Skeleton className="col-span-2 h-3 w-10" />
          <Skeleton className="col-span-2 h-3 w-12" />
          <Skeleton className="col-span-3 h-3 w-14" />
        </div>
        {/* Table rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              <Skeleton className="col-span-5 h-4 w-3/4" />
              <Skeleton className="col-span-2 h-5 w-20 rounded-full" />
              <Skeleton className="col-span-2 h-5 w-16 rounded-full" />
              <Skeleton className="col-span-3 h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
