import { Skeleton } from "@/components/ui/skeleton"

export function NavUserSkeleton() {
  return (
    <div className="flex items-center px-2 py-2 mt-1">
      <Skeleton className="h-5 w-5 rounded-full mr-3 shrink-0" />
      <Skeleton className="h-4 w-24 hidden md:block" />
    </div>
  )
}
