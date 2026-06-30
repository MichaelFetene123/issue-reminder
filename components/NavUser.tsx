// @/components/NavUser.tsx
// Async server component — reads the session and renders user info or a sign-in link.
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import NavLink from './NavLink'
import { LogInIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { logoutAction } from '@/lib/actions/mutations/auth-mutations'
import { getUserById } from '@/lib/actions/queries/user-queries'

export default async function NavUser() {
  const session = await getSession()

  if (!session) {
    return (
      <NavLink
        href="/signin"
        icon={<LogInIcon size={20} />}
        label="Sign In"
      />
    )
  }
  // Fetch just the email for display — safe, session userId is verified by JWT
const user = await getUserById(session.userId)

  const displayName = user?.email?.split('@')[0] ?? 'Account'

  return (
    <div className="space-y-1">
      {/* User identity row */}
      <div className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-muted-foreground">
        <span className="shrink-0">
          <UserIcon size={20} />
        </span>
        <span className="hidden md:inline truncate" title={user?.email ?? ''}>
          {displayName}
        </span>
      </div>

      {/* Sign out — native form action, progressively enhanced, no client boundary needed */}
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <span className="text-muted-foreground mr-3">
            <LogOutIcon size={20} />
          </span>
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </form>
    </div>
  )
}

