import Link from 'next/link'
import { Timestamp } from '@/components/Timestamp'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

async function AuthButton() {
  const session = await getSession();
  const getStartedLink = session ? "/dashboard" : "/signin";
  return (
    <Link href={getStartedLink} prefetch={true}>
      <Button size="lg">{session ? "Go to Dashboard" : "Get Started"}</Button>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
              Issue tracking <br className="hidden sm:block" />
              <span className="text-primary">
                simplified
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground font-sans tracking-tight">
              A minimal and elegant issue tracking tool for modern teams. Manage
              your projects with ease.
            </p>
            <div className="mt-10">
              <Suspense fallback={<Button size="lg">Loading...</Button>}>
                <AuthButton />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <footer className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © <Timestamp /> Issue Reminder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
