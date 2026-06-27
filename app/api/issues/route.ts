import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { issueSchema } from "@/lib/validationSchema";
import { getSession } from "@/lib/auth";


export async function POST(request: Request){
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const body = {
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        priority: formData.get('priority'),
    }
    const validation = issueSchema.safeParse(body);

    if (!validation.success){
        return NextResponse.json(
            { error: 'Validation failed', errors: validation.error.flatten().fieldErrors },
            { status: 422 }
        )
    }

    const { title, description, status, priority } = validation.data;

    const createdIssue = await prisma.issue.create({
        data: {
            title,
            description,
            status,
            priority,
            userId: session.userId,
        }
    });
    return NextResponse.json(createdIssue, {status: 201});

}