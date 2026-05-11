import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const items = await prisma.mediaItem.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = await req.json();
  const item = await prisma.mediaItem.create({
    data: {
      userId: session.user.id,
      url: body.url,
      type: body.type ?? "PHOTO",
      caption: body.caption,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(item);
}
