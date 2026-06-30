import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getIssueCount, getIssues } from '@/lib/actions/queries/issue-queries'
import { formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/validationSchema'
import {
  Plus,
  CircleDot,
  AlertCircle,
  CheckCircle2,
  Clock3,
  LayoutList,
  ListTodo,
} from 'lucide-react'
import { DeleteIssueButton } from '@/components/delete-issue-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ClickableTableRow } from '@/components/clickable-table-row'
import { StatCardsSkeleton, TableSkeleton } from '@/components/skeleton/dashboard-skeletons'
import { getSession } from '@/lib/auth'

export const metadata = {
  title: 'Dashboard · Issue Reminder',
  description: 'View and manage all your tracked issues.',
}

// ─── Types ────────────────────────────────────────────────────────────────────

type IssueStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE'
type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IssueStatus }) {
  const opt = STATUS_OPTIONS.find((o) => o.value === status)
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium ${opt?.color ?? ''}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {opt?.label ?? status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: IssuePriority }) {
  const opt = PRIORITY_OPTIONS.find((o) => o.value === priority)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium ${opt?.color ?? ''}`}
    >
      ▲ {opt?.label ?? priority}
    </span>
  )
}

// ─── Async Sub-components ─────────────────────────────────────────────────────

async function IssueStats() {
  const session = await getSession()
  if (!session) redirect('/')
  const issues = await getIssues(session.userId)
  const total = issues.length
  const backlog = issues.filter((i) => i.status === 'BACKLOG').length
  const todo = issues.filter((i) => i.status === 'TODO').length
  const inProgress = issues.filter((i) => i.status === 'IN_PROGRESS').length
  const done = issues.filter((i) => i.status === 'DONE').length

  const stats = [
    { label: 'Total Issues', value: total, icon: LayoutList, color: 'text-foreground' },
    { label: 'Backlog', value: backlog, icon: CircleDot, color: 'text-slate-400' },
    { label: 'To Do', value: todo, icon: ListTodo, color: 'text-blue-400' },
    { label: 'In Progress', value: inProgress, icon: Clock3, color: 'text-amber-400' },
    { label: 'Done', value: done, icon: CheckCircle2, color: 'text-emerald-400' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card key={label} className="shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Icon className={`size-3.5 ${color}`} />
              {label}
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function IssueTable() {
  const session = await getSession()
  if (!session) redirect('/')
  const issues = await getIssues(session.userId)

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="size-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold">No issues found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first issue.
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/dashboard/issues/new" prefetch={true}>
            <Plus className="size-4" />
            Create Issue
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-none">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-transparent border-border/40">
            <TableHead className="w-[41%] pl-6 py-3 h-auto">Title</TableHead>
            <TableHead className="py-3 h-auto">Status</TableHead>
            <TableHead className="py-3 h-auto">Priority</TableHead>
            <TableHead className="py-3 h-auto">Created</TableHead>
            <TableHead className="text-right pr-6 py-3 h-auto">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <ClickableTableRow
              key={issue.id}
              href={`/dashboard/issues/${issue.id}`}
              className="group border-border/40 even:bg-muted/30"
            >
              <TableCell className="font-medium text-sm truncate max-w-[12rem] sm:max-w-[20rem] pl-6 py-4">
                {issue.title}
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={issue.status as IssueStatus} />
              </TableCell>
              <TableCell className="py-4">
                <PriorityBadge priority={issue.priority as IssuePriority} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground py-4">
                {formatRelativeTime(new Date(issue.createdAt))}
              </TableCell>
              <TableCell className="text-right pr-6 py-4">
                <div className="flex justify-end">
                  <DeleteIssueButton id={issue.id} />
                </div>
              </TableCell>
            </ClickableTableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ____new issue button____________________

async function NewIssueButton() {
    const session = await getSession()
    if (!session) redirect('/')
  const issue = await getIssueCount(session.userId)
  if (!issue || issue === 0) {
    return null
  }
  return (
    <Button asChild size="sm" className="gap-1.5">
      <Link href="/dashboard/issues/new" prefetch={true}>
        <Plus className="size-4" />
        New Issue
      </Link>
    </Button>
  )
} 
// ─── Page (sync shell) ────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
        </div>
        <Suspense fallback={null}>
          <NewIssueButton />
        </Suspense>
      </div>

      {/* ── Stat cards ── */}
      <Suspense fallback={<StatCardsSkeleton />}>
        <IssueStats />
      </Suspense>

      {/* ── Issues table ── */}
      <Suspense fallback={<TableSkeleton />}>
        <IssueTable />
      </Suspense>
    </div>
  )
}
