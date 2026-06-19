import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/crypto"; // From your isolated file
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validationSchema";
import {z} from "zod";

export async function POST(formData: FormData) {
    try {
        const body = {
            email: formData.get('email'),
            password: formData.get('password')
        }
        
        const validation = loginSchema.safeParse(body)

        if(!validation.success){
            const flattened = z.flattenError(validation.error)
            const firstError = 
                flattened.fieldErrors.email?.[0] ||
                flattened.fieldErrors.password?.[0] ||
                "Invalid input data"

                return NextResponse.json({error: firstError}, {status: 400})
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
