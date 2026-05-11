import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const links = await req.json(); // [{platform, url, order}]

  await prisma.socialLink.deleteMany({ where: { userId: session.user.id } });

  if (links.length > 0) {
    await prisma.socialLink.createMany({
      data: links.map((l: any, i: number) => ({
        userId: session.user.id,
        platform: l.platform,
        url: l.url,
        order: i,
      })),
    });
  }

  return NextResponse.json({ success: true });
}
