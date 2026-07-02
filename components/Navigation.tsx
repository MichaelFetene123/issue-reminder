// @/components/Navigation.tsx
import { HomeIcon, PlusIcon, LayoutDashboard } from 'lucide-react'
import { Suspense } from 'react'
import NavLink from './NavLink'
import { NavUserSkeleton } from './skeleton/nav-user-skeleton'
import { getIssueCount } from '@/lib/actions/queries/issue-queries'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileDropdown } from './ProfileDropdown'

async function NewIssueLink() {
  const session = await getSession()
  const issueCount = session ? await getIssueCount(session.userId) : 0;
  const newIssueLabel = issueCount === 0 ? "Create Issue" : "Add Issue";

  return (
    <NavLink
      href="/dashboard/issues/new"
      icon={<PlusIcon size={20} />}
      label={newIssueLabel}
    />
  )
}

async function NavProfileButton() {
  const session = await getSession()
  if (!session) return null
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, image: true },
  })
  return (
    <div className="flex items-center justify-center md:justify-start px-2 py-2">
      <ProfileDropdown
        name={user?.name}
        email={user?.email}
        image={user?.image}
      />
    </div>
  )
}

export default function Navigation() {
  return (
    <aside className="fixed inset-y-0 left-0 w-16 md:w-64 bg-background shadow-md z-10 flex flex-col py-4 px-2 md:px-4">
      {/* Logo / Title */}
      <div className="flex items-center justify-center md:justify-start mb-8 px-2">
        <div className="text-xl font-bold tracking-tight text-foreground">
          <span className="hidden md:inline">Dashboard</span>
          <span className="md:hidden"><LayoutDashboard /></span>
        </div>
      </div>

      {/* Main nav links */}
      <nav className="flex-1 flex flex-col space-y-1">
        <NavLink
          href="/"
          icon={<HomeIcon size={20} />}
          label="Home"
        />
        <Suspense fallback={<NavLink href="/dashboard/issues/new" icon={<PlusIcon size={20} />} label="New Issue" />}>
          <NewIssueLink />
        </Suspense>
      </nav>

      {/* Auth section */}
      <div className="pt-4 border-t border-border">
        <Suspense fallback={<NavUserSkeleton />}>
          <NavProfileButton />
        </Suspense>
      </div>
    </aside>
  )
}
