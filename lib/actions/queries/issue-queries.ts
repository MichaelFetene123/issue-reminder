'use server'

import prisma from "@/lib/prisma"
import { cacheTag, cacheLife } from 'next/cache'

// ─── Cached Queries ───────────────────────────────────────────────────────────

export async function getIssues(userId: string) { 
  'use cache'
  cacheTag('issues')
  cacheLife('minutes')

  return prisma.issue.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getIssueById(issueId: string, userId: string) {
  'use cache'
  cacheTag('issues', `issue-${issueId}`)
  cacheLife('minutes')

  return prisma.issue.findUnique({
    where: {
      userId,
      id: issueId,
    },
    include: {
      user: true,
    },
  })
}

export async function   getIssueCount(userId: string) {
  'use cache'
  cacheTag('issues')
  cacheLife('minutes')

  return prisma.issue.count({
    where: { userId },
  })
}
