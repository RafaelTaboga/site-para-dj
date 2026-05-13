import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { formatCurrency, formatDate, EVENT_TYPE_LABELS } from "@/lib/utils";

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

  const systemPrompt = `Você é uma secretária executiva especializada em agenciamento de DJs.
Analise propostas e dê recomendações objetivas. Use R$ para valores.
Formate com as seções: ## Veredicto, ## Análise Financeira, ## Pontos de Atenção, ## Sugestão de Resposta ao Cliente

Parâmetros do DJ "${profile?.artistName ?? "DJ"}":
- Cachê mínimo: ${aiConfig?.minimumFee ? formatCurrency(aiConfig.minimumFee) : "Não definido"}
- Cachê ideal: ${aiConfig?.preferredFee ? formatCurrency(aiConfig.preferredFee) : "Não definido"}
- Distância máxima sem taxa: ${aiConfig?.maxDistanceKm ?? "Não definido"} km
- Taxa de deslocamento: ${aiConfig?.distanceFeePerKm ? `R$ ${aiConfig.distanceFeePerKm}/km` : "Não definida"}
- Equipamento próprio: ${aiConfig?.hasOwnEquipment ? "Sim" : "Não"}
- Instruções especiais: ${aiConfig?.customInstructions ?? "Nenhuma"}`;

  const userMessage = `Analise esta proposta:
- Cliente: ${proposal.clientName}
- Tipo: ${EVENT_TYPE_LABELS[proposal.eventType] ?? proposal.eventType}
- Data: ${proposal.eventDate ? formatDate(proposal.eventDate) : "Não informada"}
- Cidade: ${proposal.eventCity ?? "Não informada"}
- Convidados: ${proposal.guestCount ?? "Não informado"}
- Cachê sugerido: ${proposal.suggestedFee ? formatCurrency(proposal.suggestedFee) : "Não informado"}
- Mensagem: "${proposal.message}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 900,
  });

  const analysis = response.choices[0].message.content!;

  await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      aiAnalysis: analysis,
      aiAnalyzedAt: new Date(),
      status: "AI_ANALYZED",
    },
  });

  return NextResponse.json({ analysis });
}
