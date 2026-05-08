import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageProject } from "@/lib/permissions";
import { taskCreateSchema } from "@/lib/validators";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: user.role === "ADMIN" ? {} : { project: { members: { some: { userId: user.id } } } },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = taskCreateSchema.parse(await request.json());
  const project = await prisma.project.findUnique({
    where: { id: body.projectId },
    include: { members: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  if (!canManageProject(user, project)) {
    return NextResponse.json({ error: "Only project managers can create tasks." }, { status: 403 });
  }

  if (body.assigneeId && !project.members.some((member) => member.userId === body.assigneeId)) {
    return NextResponse.json({ error: "Assignee must be a project member." }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      projectId: body.projectId,
      title: body.title,
      description: body.description,
      priority: body.priority,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      assigneeId: body.assigneeId ?? null,
      createdById: user.id,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
