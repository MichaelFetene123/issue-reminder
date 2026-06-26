// @/components/Navigation.tsx
import Link from 'next/link'
import { HomeIcon, PlusIcon, LogInIcon, LayoutDashboard } from 'lucide-react'
import { Suspense } from 'react'
import NavLink from './NavLink'
import NavUser from './NavUser'
import { NavUserSkeleton } from './skeleton/nav-user-skeleton'

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
        <NavLink
          href="/issues/new"
          icon={<PlusIcon size={20} />}
          label="New Issue"
        />
      </nav>

      {/* Auth section — Suspense boundary streams in NavUser without blocking the sidebar */}
      <div className="pt-4 border-t border-border">
        <Suspense fallback={<NavUserSkeleton />}>
          <NavUser />
        </Suspense>
      </div>
    </aside>
  )
}
