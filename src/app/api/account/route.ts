import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { name } = await req.json();
  if (!name || name.length < 2) return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
  await prisma.user.update({ where: { id: session.user.id }, data: { name } });
  return NextResponse.json({ success: true });
}
