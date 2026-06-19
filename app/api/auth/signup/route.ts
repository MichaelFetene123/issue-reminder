// @/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/crypto";
import { signupSchema } from "@/lib/validationSchema";
import { z } from "zod"; // FIXED: Removed the unused standalone 'email' import

export async function POST(formData: FormData){
    try {
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

        const hashedPassowrd = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassowrd,
            },
            // Only fetch these specific fields back from the database to avoid password leaks
            select: {
                id: true,
                email: true,
            }
        });

        // Creates secure HTTP-only cookie and returns short-lived access token
        const accessToken = await createSession(user.id)
        if(!accessToken){
           return NextResponse.json({ error: 'Account created, but failed to log in.' }, { status: 500 });
        }

        return NextResponse.json({
            message: "User registered successfully",
            accessToken,
            user: user // Safely passed without password pollution
        });

    } catch (error) {
       console.error('Signup pipeline failure:', error);
       return NextResponse.json({error: 'Failed to create account'}, { status: 500})
    }
}
