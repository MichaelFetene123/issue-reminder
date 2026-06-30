import Link from 'next/link'
import { Timestamp } from '@/components/Timestamp'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import { getSession } from '@/lib/auth'
import { LogoutAction } from '@/components/client/LogoutAction'
import { Suspense } from 'react'

async function HeaderNav() {
  const session = await getSession()
  if (!session) return null
  return (
    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block" prefetch={true}>
      Dashboard
    </Link>
  )
}

async function AuthButtons() {
  const session = await getSession()
  if (session) {
    return (
      <LogoutAction className="cursor-pointer">
        <Button>Log out</Button>
      </LogoutAction>
    )
  }
  return (
    <>
      <Link href="/signin">
        <Button variant="outline">Sign in</Button>
      </Link>
      <Link href="/signup">
        <Button>Sign up</Button>
      </Link>
    </>
  )
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 bg-muted/80 backdrop-blur-sm ">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Issue <span className='hidden md:inline text-primary'>Reminder</span>
            </Link>
            <Suspense fallback={null}>
              <HeaderNav />
            </Suspense>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-4">
              {/* dark mode toggle */}
              <ModeToggle />
              <Suspense fallback={<div className="h-9 w-40" />}>
                <AuthButtons />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="  bg-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Mode</h3>
              <p className="text-sm text-muted-foreground">
                A modern project management tool built with Next.js.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/docs"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/yourusername/mode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8  pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; <Timestamp /> Mode. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
