import { Suspense } from 'react'
import IssueForm from '@/components/issue-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleDot, Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Create New Issue · Issue Reminder',
  description: 'Report a new issue and track it through to resolution.',
}

function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-10 w-full rounded-lg bg-muted" />
        <div className="h-3 w-44 rounded bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-28 w-full rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-14 rounded bg-muted" />
          <div className="h-10 w-full rounded-lg bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="h-10 w-full rounded-lg bg-muted" />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-8 w-20 rounded-lg bg-muted" />
        <div className="h-8 w-28 rounded-lg bg-muted" />
      </div>
    </div>
  )
}

export default function NewIssuePage() {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <CircleDot className="size-4" />
          <span>Issues</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Issue</h1>
        <p className="mt-1.5 text-muted-foreground">
          Fill in the details below to report an issue and assign it a priority
          and status.
        </p>
      </div>

      {/* Form card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base font-semibold">Issue Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Suspense fallback={<FormSkeleton />}>
            <IssueForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}