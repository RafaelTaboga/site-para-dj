import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  artistName: z.string().min(2).optional(),
  tagline: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  totalShows: z.number().int().min(0).optional().nullable(),
  yearsExperience: z.number().int().min(0).optional().nullable(),
  citiesCovered: z.number().int().min(0).optional().nullable(),
  whatsappNumber: z.string().optional(),
  baseCity: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const profile = await prisma.djProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: { include: { socialLinks: { orderBy: { order: "asc" } } } } },
  });

  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const profile = await prisma.djProfile.update({
    where: { userId: session.user.id },
    data: parsed.data,
  });

  return NextResponse.json(profile);
}
