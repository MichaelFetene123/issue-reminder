// @/lib/validationSchema.ts
import { z } from "zod";

// Catches doubled-character TLD typos like .comm .nett .orgg
// Extracts the TLD (part after last dot) and rejects if it ends in a repeated char.
// Allows 2-char country TLDs (.cc, .aa) since those are legitimate.
const noDoubledTld = (val: string): boolean => {
    const tld = val.split('.').pop() ?? '';
    if (tld.length <= 2) return true; // e.g. .cc .io .uk — legitimate 2-char TLDs
    return !/(.)\1+$/.test(tld);      // reject if last chars repeat: comm→mm, nett→tt
};

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Zod v4: z.email() is the canonical email type (z.string().email() was removed)
export const signupSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .refine(noDoubledTld, 'Please enter a valid email address'),
    password: passwordSchema,
});

export const loginSchema = z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>

