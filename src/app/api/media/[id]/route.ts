import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = await req.json();
  const item = await prisma.mediaItem.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: body,
  });
  return NextResponse.json(item);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  await prisma.mediaItem.deleteMany({
    where: { id: params.id, userId: session.user.id },
  });
  return NextResponse.json({ success: true });
}
