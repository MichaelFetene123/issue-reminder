import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const secret = process.env.CRON_SECRET;

    // Secure the endpoint so only Vercel Cron (or someone with the secret) can trigger it
    if (!secret || authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago

        const { count } = await prisma.user.deleteMany({
            where: {
                emailVerifid: false,
                createdAt: { lt: cutoff },
            },
        });

        // Log the count server-side only (not visible to users)
        console.log(`[Cleanup] Deleted ${count} unverified user(s) older than 48h`);
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Cleanup] Failed to run cleanup job:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
