import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { signupSchema } from "@/lib/validators";
import { AUTH_COOKIE_NAME, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = signupSchema.parse(await request.json());
    const existing = await prisma.user.findUnique({ where: { email: body.email } });

    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const userCount = await prisma.user.count();
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash: await bcrypt.hash(body.password, 12),
        role: userCount === 0 ? "ADMIN" : "MEMBER",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = await createSessionToken(user);
    (await cookies()).set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Please check the signup form." }, { status: 400 });
  }
}
