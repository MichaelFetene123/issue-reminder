'use server'

import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/crypto";
import { createSession, deleteSession } from "@/lib/auth";
import { loginSchema, signupSchema } from "@/lib/validationSchema";
import { randomBytes } from 'crypto';
import { sendConfirmationEmail } from "@/lib/utils/email";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type AuthActionResponse = {
    success?: boolean;
    error?: string;
    errors?: Record<string, string[]> | any;
    message?: string;
    user?: {
        id: string;
        email: string;
    };
}

export async function signupAction(
    prevState: AuthActionResponse,
    formData: FormData
): Promise<AuthActionResponse> {
    const body = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const validation = signupSchema.safeParse(body)

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        return { error: 'Validation failed', errors: fieldErrors }
    }

    const { email, password } = validation.data

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return {
                error: 'Account already exists',
                errors: { email: ['Account already exists'] }
            }
        }

        const hashedPassword = await hashPassword(password);
        const emailToken = randomBytes(32).toString('hex');
        const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                emailToken,
                emailTokenExpiry,
            },
            select: {
                id: true,
                email: true,
            }
        });

        const validateEmailLink = `${process.env.NEXT_PUBLIC_URL}/registration/confirm?token=${emailToken}`;
        const { error } = await sendConfirmationEmail(
            email,
            validateEmailLink,
            email.split('@')[0]
        );

        if (error) {
            await prisma.user.delete({ where: { id: user.id } });
            console.error("Failed to send confirmation email:", error);
            return { error: 'Failed to send confirmation email. Please try again.' }
        }

        return {
            success: true,
            message: "User registered successfully.",
            user: user
        }
    } catch (error) {
        console.error('Signup pipeline failure:', error);
        return { error: 'Failed to create account' }
    }
}

export async function loginAction(
    prevState: AuthActionResponse,
    formData: FormData
): Promise<AuthActionResponse> {
    const body = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        return { error: 'Validation failed', errors: fieldErrors }
    }

    const { email, password } = validation.data

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { error: 'Invalid authentication credentials.' }
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return { error: 'Invalid authentication credentials.' }
        }

        if (!user.emailVerifid) {
            return { error: 'Please verify your email before signing in. Check your inbox.' }
        }

        const accessToken = await createSession(user.id);
        if (!accessToken) {
            return { error: 'Failed to initialize application session.' }
        }

        // Revalidate the root layout to ensure the client drops its stale cache
        revalidatePath('/', 'layout');

        return {
            success: true,
            message: "Login successful",
            user: { id: user.id, email: user.email }
        }
    } catch (error) {
        console.error('Login pipeline failure:', error);
        return { error: 'Authentication internal server error' }
    }
}

export async function logoutAction() {
    try {
        await deleteSession();
        revalidatePath('/', 'layout');
    } catch (error) {
        console.error('Logout failed:', error);
    }
    redirect('/');
}
