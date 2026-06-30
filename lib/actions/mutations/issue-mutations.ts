'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { updateTag } from 'next/cache'
import { issueSchema } from '@/lib/validationSchema'

// ─── Shared response type ─────────────────────────────────────────────────────

export type IssueActionResponse = {
  success?: boolean
  message?: string
  error?: string
  errors?: {
    title?: string[]
    description?: string[]
    status?: string[]
    priority?: string[]
  }
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createIssue(
  prevState: IssueActionResponse,
  formData: FormData,
): Promise<IssueActionResponse> {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const body = {
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    priority: formData.get('priority'),
  }

  const validation = issueSchema.safeParse(body)
  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors }
  }

  const { title, description, status, priority } = validation.data

  try {
    await prisma.issue.create({
      data: { title, description, status, priority, userId: session.userId },
    })

    // Immediately purge the issues list cache so the dashboard reflects
    // the new issue on the very next request
    updateTag('issues')

    return { success: true, message: 'Issue created successfully.' }
  } catch {
    return { error: 'Failed to create issue. Please try again.' }
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateIssue(
  issueId: string,
  prevState: IssueActionResponse,
  formData: FormData,
): Promise<IssueActionResponse> {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const body = {
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    priority: formData.get('priority'),
  }

  const validation = issueSchema.safeParse(body)
  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors }
  }

  const { title, description, status, priority } = validation.data

  try {
    await prisma.issue.update({
      where: { id: issueId, userId: session.userId },
      data: { title, description, status, priority },
    })

    // Purge both the list cache and the individual issue cache immediately
    updateTag('issues')
    updateTag(`issue-${issueId}`)

    return { success: true, message: 'Issue updated successfully.' }
  } catch {
    return { error: 'Failed to update issue. Please try again.' }
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteOneIssue(issueId: string) {
  const session = await getSession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  try {
    await prisma.issue.delete({
      where: {
        userId: session.userId,
        id: issueId,
      },
    })
    
    updateTag('issues')
    updateTag(`issue-${issueId}`)
    
    return { success: true }
  } catch {
    return { error: 'Failed to delete issue' }
  }
}
