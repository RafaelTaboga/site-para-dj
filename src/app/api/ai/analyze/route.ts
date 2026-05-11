import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { EVENT_TYPE_LABELS, formatCurrency, formatDate } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { proposalId } = await req.json();

  const [proposal, aiConfig, profile] = await Promise.all([
    prisma.proposal.findFirst({
      where: { id: proposalId, userId: session.user.id },
    }),
    prisma.aiConfig.findUnique({ where: { userId: session.user.id } }),
    prisma.djProfile.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (!proposal) {
    return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 });
  }

  const systemPrompt = `Você é uma secretária executiva especializada em agenciamento de DJs e produtores de eventos.
Seu trabalho é analisar propostas de eventos recebidas e dar uma recomendação objetiva, prática e direta ao DJ.
Use R$ para valores. Seja assertiva. Formate a resposta em Markdown com as seções abaixo.

**Parâmetros do DJ "${profile?.artistName ?? "DJ"}":**
- Cachê mínimo: ${aiConfig?.minimumFee ? formatCurrency(aiConfig.minimumFee) : "Não definido"}
- Cachê ideal: ${aiConfig?.preferredFee ? formatCurrency(aiConfig.preferredFee) : "Não definido"}
- Cidade base: ${profile?.baseCity ?? "Não definida"}
- Distância máxima sem taxa extra: ${aiConfig?.maxDistanceKm ?? "Não definido"} km
- Taxa de deslocamento: ${aiConfig?.distanceFeePerKm ? `R$ ${aiConfig.distanceFeePerKm}/km` : "Não definida"}
- Tem equipamento próprio: ${aiConfig?.hasOwnEquipment ? "Sim" : "Não"}
- Notas sobre equipamento: ${aiConfig?.equipmentNotes ?? "Nenhuma"}
- Tipos de evento preferidos: ${aiConfig?.preferredEventTypes?.map(t => EVENT_TYPE_LABELS[t]).join(", ") || "Todos"}
- Tipos a evitar: ${aiConfig?.avoidEventTypes?.map(t => EVENT_TYPE_LABELS[t]).join(", ") || "Nenhum"}
- Instruções especiais: ${aiConfig?.customInstructions ?? "Nenhuma"}

**Estrutura obrigatória da resposta (use exatamente estes títulos):**
## Veredicto
## Análise Financeira
## Pontos de Atenção
## Sugestão de Resposta ao Cliente`;

  const userMessage = `Analise esta proposta:

**Cliente:** ${proposal.clientName} (${proposal.clientEmail}${proposal.clientPhone ? ` · ${proposal.clientPhone}` : ""})
**Tipo de Evento:** ${EVENT_TYPE_LABELS[proposal.eventType]}
**Data:** ${proposal.eventDate ? formatDate(proposal.eventDate) : "Não informada"}
**Cidade/Local:** ${proposal.eventCity ?? "Não informada"}${proposal.eventVenue ? ` — ${proposal.eventVenue}` : ""}
**Nº de Convidados:** ${proposal.guestCount ?? "Não informado"}
**Duração Estimada:** ${proposal.durationHours ? `${proposal.durationHours}h` : "Não informada"}
**Cachê Sugerido pelo Cliente:** ${proposal.suggestedFee ? formatCurrency(proposal.suggestedFee) : "Não informado"}
**Mensagem:** "${proposal.message}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 900,
    temperature: 0.7,
  });

  const analysis = response.choices[0].message.content!;

  const isPositive = analysis.toLowerCase().includes("vale a pena") ||
    analysis.toLowerCase().includes("boa proposta") ||
    analysis.toLowerCase().includes("recomendo aceitar");

  await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      aiAnalysis: analysis,
      aiAnalyzedAt: new Date(),
      status: "AI_ANALYZED",
      aiScore: isPositive ? 75 : 35,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "AI_ANALYSIS_RUN",
      metadata: { proposalId },
    },
  });

  return NextResponse.json({ analysis });
}
