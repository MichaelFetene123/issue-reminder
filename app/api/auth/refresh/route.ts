// @/app/api/auth/refresh/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyToken, generateAccessToken, generateRefreshToken } from '@/lib/auth' 

export async function POST() {
  try {
    const cookieStore = await cookies()
    const currentRefreshToken = cookieStore.get('refresh_token')?.value

    if (!currentRefreshToken) {
      return NextResponse.json({ error: 'Session expired. Please log in.' }, { status: 401 })
    }

    // Verify that the cookie hasn't been corrupted or altered
    const payload = await verifyToken(currentRefreshToken)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid refresh session.' }, { status: 401 })
    }

    // Build brand new tokens for the ongoing session
    const newAccessToken = await generateAccessToken({ userId: payload.userId })
    const newRefreshToken = await generateRefreshToken({ userId: payload.userId })

    // THE SLIDER: Reset the 24-hour cookie countdown right now
    cookieStore.set({
      name: 'refresh_token',
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // Grant them another full 24 hours from this exact instant
      path: '/',
      sameSite: 'strict',
    })

    // Return the new 15-minute key to the client's working memory
    return NextResponse.json({ accessToken: newAccessToken })
  } catch (error) {
    console.error('Error running sliding token refresh route:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
