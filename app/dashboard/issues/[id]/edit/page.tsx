import { Suspense } from 'react'
import IssueForm from '@/components/issue-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleDot } from 'lucide-react'
import { FormSkeleton } from '@/components/skeleton/issue-form-skeleton'
import { getIssueById } from '@/lib/queries/issue-queries'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Edit Issue #${id} · Issue Reminder`,
    description: 'Update the details, status, or priority of an issue.',
  }
}

export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const issue = await getIssueById(id)

  if (!issue) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <CircleDot className="size-4" />
          <span>Issues</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Issue</h1>
        <p className="mt-1.5 text-muted-foreground">
          Update the details below to modify the issue.
        </p>
      </div>

      {/* Form card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base font-semibold">Issue Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Suspense fallback={<FormSkeleton />}>
            <IssueForm issue={issue as any} isEditing />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
