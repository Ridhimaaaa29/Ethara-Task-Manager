import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getDashboardData({ id: user.id, name: user.name, email: user.email, role: user.role });
  return NextResponse.json(data);
}
