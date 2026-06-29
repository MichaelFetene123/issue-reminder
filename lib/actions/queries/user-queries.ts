"use server"

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getUserById(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    return prisma.user.findUnique({ where: { id } })
}


export async function getUserByEmail(email: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    return prisma.user.findUnique({ where: { email } })
}


