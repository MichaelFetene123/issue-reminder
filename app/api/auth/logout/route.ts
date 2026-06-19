// @/app/api/auth/logout/route.ts
import { deleteSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get('refresh_token')?.value

        // 1. Check if they even have a session cookie before trying to log out
        if (!refreshToken) {
            return NextResponse.json({ error: 'No active session to log out of.' }, { status: 400 })
        }

        // 2. FIXED: Call it with NO parameters, exactly how it's defined in lib/auth.ts
        await deleteSession()

        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error running logout route:', error)
        return NextResponse.json({ error: 'Failed to log out' }, { status: 500 })
    }
}
