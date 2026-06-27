import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { issueSchema } from "@/lib/validationSchema";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const issue = await prisma.issue.findUnique({
        where: { id },
    });

    if (!issue) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json(issue, { status: 200 });
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const body = {
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        priority: formData.get('priority'),
    };
    const validation = issueSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { error: 'Validation failed', errors: validation.error.flatten().fieldErrors },
            { status: 422 }
        );
    }

    const { title, description, status, priority } = validation.data;

    const updatedIssue = await prisma.issue.update({
        where: { id },
        data: { title, description, status, priority },
    });
    return NextResponse.json(updatedIssue, { status: 200 });
}

// PATCH is an alias for PUT (partial update via IssueForm)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return PUT(request, { params });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    await prisma.issue.delete({ where: { id } });
    return NextResponse.json({ message: 'Issue deleted successfully' }, { status: 200 });
}
