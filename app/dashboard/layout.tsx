import React, { Suspense } from "react"
import Navigation from "@/components/Navigation"
import { DashboardPageSkeleton } from "@/components/skeleton/DashboardPageSkeleton"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

interface childrenProps {
    children: React.ReactNode
}
export default async function DashboardLayout({ children }: childrenProps) {
    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    return (
        <div className='min-h-screen'>
            <Navigation />
            <main className="pl-16 md:pl-64 pt-0 min-h-screen">
                <div className="max-w-6xl mx-auto p-4 md:p-8">
                    <Suspense fallback={<DashboardPageSkeleton />}>{children}</Suspense>
                </div>
            </main>
        </div>
    )
}
