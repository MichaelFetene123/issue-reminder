
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from 'next/cache'

// Get user by ID
export async function getUserById(id: string) {
    'use cache'
    cacheTag('users')
    cacheLife('minutes')
    return prisma.user.findUnique({ 
        where: { id }, 
        select: { email: true } 
    })
}




