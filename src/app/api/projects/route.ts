import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { projectCreateSchema } from "@/lib/validators";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: user.role === "ADMIN" ? {} : { members: { some: { userId: user.id } } },
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true, role: true } },
      members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
    },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins can create projects." }, { status: 403 });
  }

  try {
    const body = projectCreateSchema.parse(await request.json());
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        ownerId: user.id,
        members: { create: [{ userId: user.id }] },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: "Could not create project." }, { status: 400 });
    }

    return NextResponse.json({ error: "Please check the project form." }, { status: 400 });
  }
}
