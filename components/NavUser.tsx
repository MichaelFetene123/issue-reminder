// @/components/NavUser.tsx
// Async server component — reads the session and renders user info or a sign-in link.
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import NavLink from './NavLink'
import { LogInIcon, UserIcon } from 'lucide-react'
import { getUserById } from '@/lib/actions/queries/user-queries'

export default async function NavUser() {
  const session = await getSession()

  if (!session) {
    return null
  }
  // Fetch just the email for display — safe, session userId is verified by JWT
  const user = await getUserById(session.userId)

  const displayName = user?.email?.split('@')[0] ?? 'Account'

  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-muted-foreground">
      <span className="shrink-0">
        <UserIcon size={20} />
      </span>
      <span className="hidden md:inline truncate" title={user?.email ?? ''}>
        {displayName}
      </span>
    </div>
  )
}

