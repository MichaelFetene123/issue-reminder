// @/lib/crypto.ts
import { compare, hash } from 'bcrypt'

// Hash Password 
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10)  
}

// Verify Password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}
