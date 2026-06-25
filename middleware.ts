import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-fallback-secret-key-32-chars'
);

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('refresh_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        try {
            // Verify the token
            await jwtVerify(token, JWT_SECRET);
        } catch (error) {
            // Token is invalid or expired
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard/:path*'],
}
