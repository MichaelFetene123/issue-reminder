import { Skeleton } from '@/components/ui/skeleton'

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-card p-4 space-y-2">
          <Skeleton className="h-3 w-16 sm:w-20" />
          <Skeleton className="h-7 w-8 sm:w-10" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="rounded-xl bg-card overflow-hidden">
      {/* Mobile: 2-col layout (title + status only) */}
      <div className="md:hidden">
        <div className="flex gap-4 px-4 py-3">
          <Skeleton className="h-3 w-24 flex-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-4 items-center">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-5 w-16 rounded-full shrink-0" />
          </div>
        ))}
      </div>

      {/* Desktop: full 4-col layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 gap-4 px-6 py-3">
          <Skeleton className="col-span-5 h-3 w-10" />
          <Skeleton className="col-span-2 h-3 w-10" />
          <Skeleton className="col-span-2 h-3 w-12" />
          <Skeleton className="col-span-3 h-3 w-14" />
        </div>
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
  )
}
