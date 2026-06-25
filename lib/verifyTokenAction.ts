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

    // 2. Check if the token has expired (24-hour window)
    if (!user.emailTokenExpiry || user.emailTokenExpiry < new Date()) {
        // Free up the email immediately so the user can re-register
        await prisma.user.delete({ where: { id: user.id } });
        throw new Error("Your verification link is invalid or expired. Please sign up again to receive a new link.");
    }

    // 3. Update user to verified and clear the token + expiry
    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailToken: "",
            emailTokenExpiry: null,
            emailVerifid: true,
        }
    });

    // 4. Create session (since we removed it from the signup route)
    // This correctly sets the cookie on the server-side
    const accessToken = await createSession(user.id);
    
    if (!accessToken) {
        throw new Error("Failed to create session");
    }

    return { success: true };
}
