// @/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/crypto";
import { signupSchema } from "@/lib/validationSchema";
import { z } from "zod"; // FIXED: Removed the unused standalone 'email' import
import {v4 as uuidv4} from 'uuid';
import { sendConfirmationEmail } from "@/lib/utils/email";


export type ActionResponse = {
    success?: boolean;
    error?: string;
    errors?: Record<string, string[]> | any;
    user?: {
        id: string;
        email: string;
    };
    message?: string;
}

export async function POST(request: Request){
    try {
        const formData = await request.formData();
        const body = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        const validation = signupSchema.safeParse(body)

        if(!validation.success){
            // Pass the error directly to the top-level flattenError function
            const flattened = z.flattenError(validation.error); //
            
            // Get the first error from email, or first error from password, or a fallback string
            const firstError = 
                flattened.fieldErrors.email?.[0] || 
                flattened.fieldErrors.password?.[0] || 
                "Invalid input data";
                
             return NextResponse.json({error: firstError}, {status: 400})
        }

        const validatedData = validation.data
        const {email, password} = validatedData

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({where: {email}})
        if(existingUser){
            return NextResponse.json({error: 'Account already exists'}, {status: 400})
        }

        // Hashing password
        const hashedPassowrd = await hashPassword(password);


        // verification token
        const emailToken = uuidv4()

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassowrd,
                emailToken,
            },
            // Only fetch these specific fields back from the database to avoid password leaks
            select: {
                id: true,
                email: true,
            }
        });

        // Send confirmation email
        const validateEmailLink = `${process.env.NEXT_PUBLIC_URL}/registration/confirm?token=${emailToken}`;
        const { error } = await sendConfirmationEmail(
            email,
            validateEmailLink,
            email.split('@')[0]
        );
        
        if (error) {
            // Roll back user creation if the email fails to send
            // This prevents the user from being stuck in an unverified state where they can't sign up again
            await prisma.user.delete({ where: { id: user.id } });
            console.error("Failed to send confirmation email:", error);
            return NextResponse.json({ error: 'Failed to send confirmation email. Please try again.' }, { status: 500 });
        }

        return NextResponse.json({
            message: "User registered successfully.",
            user: user
        });

    } catch (error) {
       console.error('Signup pipeline failure:', error);
       return NextResponse.json({error: 'Failed to create account'}, { status: 500})
    }
}
