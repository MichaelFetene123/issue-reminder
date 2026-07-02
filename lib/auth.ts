// @/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// JWT types
interface JWTPayload {
  userId: string
  [key: string]: string | number | boolean | null | undefined
}

// Convert secret string into a byte array for the Web Crypto API
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-fallback-secret-key-32-chars'
);

export const ACCESS_TOKEN_EXPIRATION = '15m'     // Access token lasts 15 minutes
export const REFRESH_TOKEN_EXPIRATION = '24h'     // Refresh token lasts 24 hours
export const REFRESH_THRESHOLD = 2 * 60           // Refresh 2 minutes before expiration
const COOKIE_MAX_AGE = 24 * 60 * 60;              // 24 hours in seconds

// Generate a short-lived access token
export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
    .sign(JWT_SECRET);
}

// Generate a long-lived refresh token
export async function generateRefreshToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRATION)
    .sign(JWT_SECRET);
}

// Verify any JWT token structurally
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// Determines if the short-lived access token needs to be swapped
export async function shouldRefreshAccessToken(accessToken: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(accessToken, JWT_SECRET, {
      clockTolerance: 15, 
    })

    const exp = payload.exp
    if (typeof exp !== 'number') return true

    const now = Math.floor(Date.now() / 1000)
    return (exp - now) < REFRESH_THRESHOLD
  } catch {
    return true 
  }
}

// Initial Session Creation (On Login/Register)
export async function createSession(userId: string): Promise<string | null> {
  try {
    const accessToken = await generateAccessToken({ userId })
    const refreshToken = await generateRefreshToken({ userId })

    const cookieStore = await cookies();

    cookieStore.set({
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'strict', 
    })

    return accessToken;
  } catch (error) {
    console.error('Failed to create session:', error)
    return null
  }
}

// Server-side check to see if the user is logged in
export const getSession = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('refresh_token')?.value;
    
    let activeUserId: string | null = null;

    if (token) {
      const payload = await verifyToken(token)
      if (payload && payload.userId && typeof payload.userId === 'string') {
        activeUserId = payload.userId;
      }
    }
    
    if (!activeUserId) {
      const nextSession = await auth();
      if (nextSession?.user?.id) {
        activeUserId = nextSession.user.id;
      }
    }

    if (activeUserId) {
      // Verify user actually exists in the database still
      const userExists = await prisma.user.findUnique({
        where: { id: activeUserId },
        select: { id: true },
      });

      if (userExists) {
        return { userId: activeUserId };
      }
    }
    
    return null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('During prerendering')) {
      return null
    }
    console.error('Failed to get session:', error)
    return null
  }
})

// Completely clears the session
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('refresh_token')
}

