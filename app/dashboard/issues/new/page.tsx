import { Suspense } from 'react'
import IssueForm from '@/components/issue-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleDot } from 'lucide-react'
import { FormSkeleton } from '@/components/skeleton/issue-form-skeleton'

export const metadata = {
  title: 'Create New Issue · Issue Reminder',
  description: 'Report a new issue and track it through to resolution.',
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
        <CardHeader className="border-b border-border">
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