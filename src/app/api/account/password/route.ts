import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { currentPassword, newPassword } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  const valid = await compare(currentPassword, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });
  const passwordHash = await hash(newPassword, 12);
  await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash } });
  return NextResponse.json({ success: true });
}
