import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canEditTask, canManageProject } from "@/lib/permissions";
import { taskStatusOnlySchema, taskUpdateSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  const isManager = canManageProject(user, task.project);
  const body = await request.json();

  if (!isManager) {
    const statusOnly = taskStatusOnlySchema.parse(body);
    if (task.assigneeId !== user.id) {
      return NextResponse.json({ error: "You can only update tasks assigned to you." }, { status: 403 });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        status: statusOnly.status,
        completedAt: statusOnly.status === "DONE" ? new Date() : null,
      },
    });

    return NextResponse.json({ task: updated });
  }

  const data = taskUpdateSchema.parse(body);

  if (data.assigneeId !== undefined && data.assigneeId !== null) {
    const isMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId: data.assigneeId } },
    });

    if (!isMember) {
      return NextResponse.json({ error: "Assignee must belong to the project." }, { status: 400 });
    }
  }

  const updated = await prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate === undefined ? undefined : data.dueDate === null ? null : new Date(data.dueDate),
      assigneeId: data.assigneeId === undefined ? undefined : data.assigneeId,
      completedAt: data.status === "DONE" ? new Date() : data.status ? null : undefined,
    },
  });

  return NextResponse.json({ task: updated });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const task = await prisma.task.findUnique({ where: { id }, include: { project: true } });
  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  if (!canEditTask(user, task, canManageProject(user, task.project))) {
    return NextResponse.json({ error: "You cannot delete this task." }, { status: 403 });
  }

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
