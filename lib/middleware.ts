// @/lib/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')

  // If trying to access a secure dashboard page but inactive for >24 hours
  if (isProtectedRoute && !refreshToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Map exactly which pages require the active session cookie
export const config = {
  matcher: ['/dashboard/:path*'],
}
