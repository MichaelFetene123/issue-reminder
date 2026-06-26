import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/crypto"; // From your isolated file
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validationSchema";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const body = {
            email: formData.get('email'),
            password: formData.get('password')
        }
        
        const validation = loginSchema.safeParse(body)

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            return NextResponse.json(
                { error: 'Validation failed', errors: fieldErrors },
                { status: 422 }
            );
        }

        const validatedData = validation.data
        const {email, password} = validatedData

        
        // Check if the user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Invalid authentication credentials.' }, { status: 401 });
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid authentication credentials.' }, { status: 401 });
        }

        // Prevent sign-in until email is verified
        if (!user.emailVerifid) {
            return NextResponse.json(
                { error: 'Please verify your email before signing in. Check your inbox.' },
                { status: 403 }
            );
        }

        // Establishes sliding cookies and gives frontend its short-lived tracking token
        const accessToken = await createSession(user.id);
        if (!accessToken) {
            return NextResponse.json({ error: 'Failed to initialize application session.' }, { status: 500 });
        }

        return NextResponse.json({
            message: "Login successful",
            accessToken,
            user: { id: user.id, email: user.email }
        }, { status: 200 });

    } catch (error) {
        console.error('Login pipeline failure:', error);
        return NextResponse.json({ error: 'Authentication internal server error' }, { status: 500 });
    }
}
