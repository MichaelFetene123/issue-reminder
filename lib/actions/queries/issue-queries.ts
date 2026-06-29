
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getIssues() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  return prisma.issue.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getIssueById(issueId: string) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  return prisma.issue.findUnique({
    where: {
      userId: session.userId,
      id: issueId
    },
    include: {
      user: true
    }
  })
}

export async function getIssueCount() {
  const session = await getSession()
  if (!session) return 0

  return prisma.issue.count({
    where: { userId: session.userId }
  })
}

export async function deleteOneIssue(issueId: string) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  try {
    const deletedIssue = await prisma.issue.delete({
      where: {
        userId: session.userId,
        id: issueId
      }
    })    
    revalidatePath('/dashboard')
    return deletedIssue
  } catch (error) {
    throw new Error('Failed to delete issue')
  }
}