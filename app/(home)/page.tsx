import Link from 'next/link'
import { Timestamp } from '@/components/Timestamp'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
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
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
              A minimal and elegant issue tracking tool for modern teams. Manage
              your projects with ease.
            </p>
            <div className="mt-10">
              <Link href="/signin">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © <Timestamp /> Mode. Built for Next.js Fundamentals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
