import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await hash("demo1234", 12);
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 7);

  const user = await prisma.user.upsert({
    where: { email: "djkauan@demo.com" },
    update: {},
    create: {
      email: "djkauan@demo.com",
      passwordHash,
      name: "Kauan Souza",
      slug: "dj-kauan",
      profile: {
        create: {
          artistName: "DJ Kauan",
          tagline: "O som que transforma sua festa",
          bio: "DJ profissional com mais de 10 anos de experiência nos melhores eventos de São Paulo. Especialista em eletrônico, pop e funk. Cada show é único — do line-up à energia na pista.",
          accentColor: "#00FF87",
          isPublished: true,
          totalShows: 200,
          yearsExperience: 10,
          citiesCovered: 15,
          baseCity: "São Paulo, SP",
          whatsappNumber: "+5511999990000",
        },
      },
      subscription: {
        create: {
          status: "ACTIVE",
          trialStartsAt: new Date(),
          trialEndsAt,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      aiConfig: {
        create: {
          minimumFee: 1500,
          preferredFee: 3000,
          maxDistanceKm: 80,
          distanceFeePerKm: 2.0,
          hasOwnEquipment: true,
          equipmentNotes: "Tenho sistema de som até 2000W. Festas maiores precisam locar estrutura.",
          customInstructions: "Sempre cobro 50% de sinal antecipado. Não aceito shows de menos de 3 horas.",
          preferredEventTypes: ["WEDDING", "CORPORATE", "UNIVERSITY"],
        },
      },
      socialLinks: {
        createMany: {
          data: [
            { platform: "instagram", url: "https://instagram.com/djkauan", order: 0 },
            { platform: "tiktok", url: "https://tiktok.com/@djkauan", order: 1 },
            { platform: "spotify", url: "https://open.spotify.com/artist/djkauan", order: 2 },
          ],
        },
      },
    },
  });

  // Seed proposals
  await prisma.proposal.createMany({
    data: [
      {
        userId: user.id,
        clientName: "Mariana Costa",
        clientEmail: "mariana@exemplo.com",
        clientPhone: "+5511988880001",
        eventType: "WEDDING",
        eventDate: new Date("2025-08-15"),
        eventCity: "São Paulo, SP",
        eventVenue: "Espaço Villa Bisutti",
        guestCount: 180,
        durationHours: 6,
        suggestedFee: 2800,
        message: "Boa tarde! Tenho um casamento em agosto no Ibirapuera. Gostaria de orçamento para 6 horas de festa, das 20h às 2h. É um casamento, público mais adulto, queremos pop e eletrônico.",
        status: "NEW",
        emailSentToDj: true,
        emailSentAt: new Date(),
      },
      {
        userId: user.id,
        clientName: "Rafael Mendes",
        clientEmail: "rafael@techcorp.com.br",
        clientPhone: "+5511977770002",
        eventType: "CORPORATE",
        eventDate: new Date("2025-07-20"),
        eventCity: "Campinas, SP",
        guestCount: 300,
        durationHours: 5,
        suggestedFee: 4500,
        message: "Evento corporativo de encerramento de ano da nossa empresa de tecnologia. Público jovem entre 25-35 anos. Queremos set eletrônico e pop internacional. Salão tem sistema de som próprio.",
        status: "AI_ANALYZED",
        aiAnalysis: "## Veredicto\n✅ **PROPOSTA VALE A PENA** — Evento corporativo de empresa de tech com budget sólido.\n\n## Análise Financeira\nCachê sugerido de R$ 4.500 está **acima do seu mínimo** de R$ 1.500. Campinas fica ~95km da base, o que implica taxa de deslocamento de ~R$ 190. Valor líquido de R$ 4.310 ainda é excelente.\n\n## Pontos de Atenção\n- Confirmar se salão tem sistema de som (já mencionou que sim ✓)\n- Verificar cronograma: corporativos costumam ter horário rígido\n- Solicitar briefing musical com referências da empresa\n\n## Sugestão de Resposta ao Cliente\n\"Rafael, adorei o briefing! Para esse perfil, meu valor é R$ 5.000 (inclui deslocamento até Campinas). Trabalho com 50% de sinal na assinatura do contrato. Posso enviar proposta formal com rider técnico esta semana?\"",
        aiAnalyzedAt: new Date(),
        aiScore: 82,
        emailSentToDj: true,
        emailSentAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed concluído!");
  console.log("   Login demo: djkauan@demo.com / demo1234");
  console.log("   Site público: /dj-kauan");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
