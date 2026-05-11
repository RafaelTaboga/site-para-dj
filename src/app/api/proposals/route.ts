import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM } from "@/lib/resend";
import { z } from "zod";
import { EVENT_TYPE_LABELS, formatDate } from "@/lib/utils";

const proposalSchema = z.object({
  djSlug: z.string(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  eventType: z.enum(["WEDDING","CORPORATE","BIRTHDAY","UNIVERSITY","NIGHTCLUB","FESTIVAL","OTHER"]).default("OTHER"),
  eventDate: z.string().optional(),
  eventCity: z.string().optional(),
  eventVenue: z.string().optional(),
  guestCount: z.string().optional(),
  durationHours: z.string().optional(),
  suggestedFee: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = proposalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { djSlug, ...data } = parsed.data;

    const dj = await prisma.user.findUnique({
      where: { slug: djSlug },
      include: { profile: true },
    });

    if (!dj || !dj.profile?.isPublished) {
      return NextResponse.json({ error: "DJ não encontrado" }, { status: 404 });
    }

    const proposal = await prisma.proposal.create({
      data: {
        userId: dj.id,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        eventType: data.eventType,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        eventCity: data.eventCity,
        eventVenue: data.eventVenue,
        guestCount: data.guestCount ? parseInt(data.guestCount) : null,
        durationHours: data.durationHours ? parseFloat(data.durationHours) : null,
        suggestedFee: data.suggestedFee ? parseFloat(data.suggestedFee) : null,
        message: data.message,
      },
    });

    // Send email notification to DJ
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: dj.email,
        subject: `🎵 Nova proposta de ${data.clientName}!`,
        html: `
          <div style="font-family: system-ui; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #f0f0f8; padding: 32px; border-radius: 16px;">
            <h1 style="color: #00FF87; font-size: 24px; margin-bottom: 8px;">Nova Proposta Recebida! 🎵</h1>
            <p style="color: #9ca3af;">Olá, ${dj.profile.artistName}! Você recebeu uma nova proposta.</p>
            <hr style="border-color: #1e1e30; margin: 24px 0;" />
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Cliente</td><td style="padding: 8px 0; font-weight: 600;">${data.clientName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">E-mail</td><td style="padding: 8px 0;">${data.clientEmail}</td></tr>
              ${data.clientPhone ? `<tr><td style="padding: 8px 0; color: #6b7280;">Telefone</td><td style="padding: 8px 0;">${data.clientPhone}</td></tr>` : ""}
              <tr><td style="padding: 8px 0; color: #6b7280;">Tipo de Evento</td><td style="padding: 8px 0;">${EVENT_TYPE_LABELS[data.eventType]}</td></tr>
              ${data.eventDate ? `<tr><td style="padding: 8px 0; color: #6b7280;">Data</td><td style="padding: 8px 0;">${formatDate(data.eventDate)}</td></tr>` : ""}
              ${data.eventCity ? `<tr><td style="padding: 8px 0; color: #6b7280;">Cidade</td><td style="padding: 8px 0;">${data.eventCity}</td></tr>` : ""}
              ${data.guestCount ? `<tr><td style="padding: 8px 0; color: #6b7280;">Convidados</td><td style="padding: 8px 0;">${data.guestCount}</td></tr>` : ""}
              ${data.suggestedFee ? `<tr><td style="padding: 8px 0; color: #6b7280;">Cachê Sugerido</td><td style="padding: 8px 0; color: #00FF87; font-weight: 700;">R$ ${parseFloat(data.suggestedFee).toLocaleString("pt-BR")}</td></tr>` : ""}
            </table>
            <div style="background: #1a1a2e; border-radius: 8px; padding: 16px; margin-top: 16px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px;">Mensagem:</p>
              <p style="margin: 0; line-height: 1.6;">${data.message}</p>
            </div>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/proposals/${proposal.id}" style="display: inline-block; margin-top: 24px; background: #00FF87; color: #000; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700;">Ver Proposta no Painel →</a>
          </div>
        `,
      });

      await prisma.proposal.update({
        where: { id: proposal.id },
        data: { emailSentToDj: true, emailSentAt: new Date() },
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    return NextResponse.json({ success: true, proposalId: proposal.id });
  } catch (err) {
    console.error("Proposal error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// GET: List proposals for logged-in DJ
export async function GET(req: NextRequest) {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 10;

  const proposals = await prisma.proposal.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status: status as any } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.proposal.count({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ proposals, total, page, limit });
}
