import { getIssueById } from '@/lib/actions/queries/issue-queries'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, Edit2Icon } from 'lucide-react'
import { DeleteIssueButton } from '@/components/delete-issue-button'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/validationSchema'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const issue = await getIssueById(id)

  if (!issue) {
    notFound()
  }

  const { title, description, status, priority, createdAt, updatedAt, user } = issue

  const statusOpt = STATUS_OPTIONS.find(opt => opt.value === status) || { label: status, color: 'text-gray-500' }
  const priorityOpt = PRIORITY_OPTIONS.find(opt => opt.value === priority) || { label: priority, color: 'text-gray-500' }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Issues
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <div className="flex items-center space-x-2">
            <Link href={`/dashboard/issues/${id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5 transition-all hover:bg-secondary/80">
                <Edit2Icon size={14} />
                Edit
              </Button>
            </Link>
            <DeleteIssueButton id={id} />
          </div>
        </div>
      </div>

      <Card className="mb-8 transition-all hover:shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary/50 border shadow-sm ${statusOpt.color}`}>
              <span className="mr-1.5 text-[10px]">●</span>
              {statusOpt.label}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary/50 border shadow-sm ${priorityOpt.color}`}>
              <span className="mr-1.5 text-[10px]">▲</span>
              {priorityOpt.label}
            </span>
            <div className="text-sm text-muted-foreground">
              Created {formatRelativeTime(new Date(createdAt))}
            </div>
            {updatedAt.getTime() !== createdAt.getTime() && (
              <div className="text-sm text-muted-foreground">
                (Updated {formatRelativeTime(new Date(updatedAt))})
              </div>
            )}
          </div>

          {description ? (
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
              <p className="whitespace-pre-line leading-relaxed">{description}</p>
            </div>
          ) : (
            <p className="text-muted-foreground/60 italic text-sm">No description provided.</p>
          )}
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-secondary/20 rounded-lg p-4 border border-secondary/30">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Assigned to
              </p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
              <span className={`inline-flex items-center font-medium ${statusOpt.color} text-sm`}>
                {statusOpt.label}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</p>
              <span className={`inline-flex items-center font-medium ${priorityOpt.color} text-sm`}>
                {priorityOpt.label}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</p>
              <p className="text-sm font-medium">{formatRelativeTime(new Date(createdAt))}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}