import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const config = await prisma.aiConfig.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json(config);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = await req.json();
  const config = await prisma.aiConfig.upsert({
    where: { userId: session.user.id },
    update: body,
    create: { userId: session.user.id, ...body },
  });
  return NextResponse.json(config);
}
