"use server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function verifyTokenAction(token: string) {
    // 1. Find user by token
    const user = await prisma.user.findFirst({
        where: { emailToken: token }
    });

    if (!user) {
        throw new Error("Invalid or expired token");
    }

    // 2. Update user to verified and remove the token
    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailToken: "",
            emailVerifid: true,
        }
    });

    // 3. Create session (since we removed it from the signup route)
    // This correctly sets the cookie on the server-side
    const accessToken = await createSession(user.id);
    
    if (!accessToken) {
        throw new Error("Failed to create session");
    }

    return { success: true };
}
