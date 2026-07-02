'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  AlertCircle,
  Loader2,
  Flag,
  Tag,
  AlignLeft,
  ArrowLeft,
} from 'lucide-react'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/validationSchema'
import { createIssue, updateIssue, type IssueActionResponse } from '@/lib/actions/mutations/issue-mutations'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Issue {
  id: string | number
  title: string
  description: string
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface IssueFormProps {
  issue?: Issue
  isEditing?: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────

const initialState: IssueActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IssueForm({ issue, isEditing = false }: IssueFormProps) {
  const router = useRouter()

  const action = isEditing
    ? updateIssue.bind(null, String(issue!.id))
    : createIssue

  const [state, formAction, isPending] = useActionState(action, initialState)
  const handledState = useRef(state)

  useEffect(() => {
    // If the state hasn't changed since we last handled it (or since mount),
    // do nothing. This completely blocks Next.js from aggressively restoring 
    // cached success states on page load.
    if (handledState.current === state) return
    handledState.current = state

    if (state?.success) {
      router.push(isEditing ? `/dashboard/issues/${issue!.id}` : '/dashboard')
      toast.success(state.message)
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, router, isEditing, issue])


  return (
    <form action={formAction} noValidate className="space-y-6">
      {/* Global error banner */}
      {state?.error && !state?.errors && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}


      <FieldGroup>
        {/* Title */}
        <Field>
          <FieldLabel htmlFor="title" className="flex items-center gap-2">
            <Tag className="size-3.5 text-muted-foreground" />
            Title
          </FieldLabel>
          <Input
            id="title"
            name="title"
            placeholder="Issue title…"
            defaultValue={issue?.title ?? ''}
            required
            minLength={3}
            maxLength={100}
            disabled={isPending}
            aria-invalid={!!state?.errors?.title}
            aria-describedby="title-error"
            className="h-10 text-sm"
          />
          {state?.errors?.title && (
            <FieldError id="title-error">{state.errors.title[0]}</FieldError>
          )}
        </Field>

        {/* Description */}
        <Field>
          <FieldLabel htmlFor="description" className="flex items-center gap-2">
            <AlignLeft className="size-3.5 text-muted-foreground" />
            Description
          </FieldLabel>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the issue in detail"
            rows={5}
            defaultValue={issue?.description ?? ''}
            disabled={isPending}
            aria-invalid={!!state?.errors?.description}
            aria-describedby="description-error"
            className="resize-none text-sm"
          />
          {state?.errors?.description && (
            <FieldError id="description-error">
              {state.errors.description[0]}
            </FieldError>
          )}
        </Field>

        {/* Status + Priority side by side */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Status */}
          <Field>
            <FieldLabel htmlFor="status" className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-blue-400" />
              Status
            </FieldLabel>
            <Select
              name="status"
              defaultValue={issue?.status ?? 'BACKLOG'}
              disabled={isPending}
              required
            >
              <SelectTrigger
                id="status"
                className="w-full h-10"
                aria-invalid={!!state?.errors?.status}
                aria-describedby="status-error"
              >
                <SelectValue placeholder="Select status…" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className={opt.color}>●</span>
                    &nbsp;{opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.status && (
              <FieldError id="status-error">{state.errors.status[0]}</FieldError>
            )}
          </Field>

          {/* Priority */}
          <Field>
            <FieldLabel htmlFor="priority" className="flex items-center gap-2">
              <Flag className="size-3.5 text-muted-foreground" />
              Priority
            </FieldLabel>
            <Select
              name="priority"
              defaultValue={issue?.priority ?? 'MEDIUM'}
              disabled={isPending}
              required
            >
              <SelectTrigger
                id="priority"
                className="w-full h-10"
                aria-invalid={!!state?.errors?.priority}
                aria-describedby="priority-error"
              >
                <SelectValue placeholder="Select priority…" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className={opt.color}>▲</span>
                    &nbsp;{opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.priority && (
              <FieldError id="priority-error">
                {state.errors.priority[0]}
              </FieldError>
            )}
          </Field>
        </div>
      </FieldGroup>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          id="cancel-issue"
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          disabled={isPending}
          className="gap-1.5 hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Cancel
        </Button>

        <Button
          id="submit-issue"
          type="submit"
          size="sm"
          disabled={isPending}
          className="min-w-28 gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isEditing ? 'Saving…' : 'Creating…'}
            </>
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Create Issue'
          )}
        </Button>
      </div>
    </form>
  )
}
