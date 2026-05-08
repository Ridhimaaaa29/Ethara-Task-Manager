import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageProject } from "@/lib/permissions";
import { memberAddSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  if (!canManageProject(user, project)) {
    return NextResponse.json({ error: "Only project managers can add members." }, { status: 403 });
  }

  const body = memberAddSchema.parse(await request.json());
  const member = await prisma.user.findUnique({ where: { email: body.email } });
  if (!member) {
    return NextResponse.json({ error: "No account uses that email yet." }, { status: 404 });
  }

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: id, userId: member.id } },
    create: { projectId: id, userId: member.id },
    update: {},
  });

  return NextResponse.json({ ok: true });
}
