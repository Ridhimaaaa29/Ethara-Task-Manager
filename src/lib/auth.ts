import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/db";

export const AUTH_COOKIE_NAME = "ethara_session";
const SESSION_DAYS = 7;

type SessionPayload = {
  userId: string;
  email: string;
  role: User["role"];
  name: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is missing");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: Pick<User, "id" | "email" | "name" | "role">) {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as SessionPayload;
}

export async function getSessionUser() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    const session = await verifySessionToken(token);
    return prisma.user.findUnique({ where: { id: session.userId } });
  } catch {
    return null;
  }
}
