// @/lib/schemas.ts
import { z } from "zod";

export const signupSchema = z.object({
    // FIXED: Use top-level z.email() and pass the message inside an object
    email: z.email({ message: 'Please enter a valid email' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
    // FIXED: Use top-level z.email() without explicit warning triggers
    email: z.email({ message: 'Please enter a valid email' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
