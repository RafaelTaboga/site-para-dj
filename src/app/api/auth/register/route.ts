import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { generateUniqueSlug } from "@/lib/utils";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  artistName: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password, artistName } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    const slug = await generateUniqueSlug(artistName);

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name, email, passwordHash, slug,
          profile: { create: { artistName, accentColor: "#00FF87", isPublished: false } },
          subscription: { create: { status: "TRIALING", trialStartsAt: new Date(), trialEndsAt } },
          aiConfig: { create: {} },
        },
      });

      await tx.auditLog.create({
        data: { userId: user.id, action: "USER_REGISTERED", metadata: JSON.stringify({ email, slug }) },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
