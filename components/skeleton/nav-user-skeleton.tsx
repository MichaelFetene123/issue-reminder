import { Skeleton } from "@/components/ui/skeleton"
import { LogOutIcon } from "lucide-react"

export function NavUserSkeleton() {
  return (
    <div className="space-y-1">
      {/* Skeleton only for the username row */}
      <div className="flex items-center px-2 py-2 mt-1">
        <Skeleton className="h-5 w-5 rounded-full mr-3 shrink-0" />
        <Skeleton className="h-4 w-24 hidden md:block" />
      </div>
      {/* Static Sign Out visually so layout doesn't shift */}
      <div className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-muted-foreground opacity-50 pointer-events-none">
        <span className="text-muted-foreground mr-3">
          <LogOutIcon size={20} />
        </span>
        <span className="hidden md:inline">Sign Out</span>
      </div>
    </div>
  )
}
