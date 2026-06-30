import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-fallback-secret-key-32-chars'
);

const AUTH_PAGES = ['/login', '/signup', '/registration/pending', '/registration/confirm'];

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('refresh_token')?.value;
    const { pathname } = request.nextUrl;

    let hasValidSession = false;

    if (token) {
        try {
            await jwtVerify(token, JWT_SECRET);
            hasValidSession = true;
        } catch {
            hasValidSession = false;
        }
    }

    // Protect dashboard routes (redirect to home if not logged in)
    if (pathname.startsWith('/dashboard')) {
        if (!hasValidSession) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Redirect logged-in users away from auth pages
    // IMPORTANT: Skip this check for Next.js Server Action requests.
    // Server Actions POST to the same URL with a "Next-Action" header.
    // If we redirect those, Next.js receives a 302 instead of an action
    // response, which causes "An unexpected response was received from the server".
    const isServerAction = request.headers.has('Next-Action');
    if (!isServerAction && AUTH_PAGES.some(page => pathname.startsWith(page))) {
        if (hasValidSession) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup', '/registration/:path*'],
}
