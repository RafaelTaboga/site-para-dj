import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const userId = session.user.id as string;
  const links = await req.json();

  await prisma.socialLink.deleteMany({ where: { userId } });

  if (links.length > 0) {
    await prisma.socialLink.createMany({
      data: links.map((l: any, i: number) => ({
        userId,
        platform: l.platform,
        url: l.url,
        order: i,
      })),
    });
  }

  return NextResponse.json({ success: true });
}
