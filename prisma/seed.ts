import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

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
          bio: "DJ profissional com mais de 10 anos de experiência.",
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
          customInstructions: "Sempre cobro 50% de sinal antecipado.",
        },
      },
      socialLinks: {
        createMany: {
          data: [
            { platform: "instagram", url: "https://instagram.com/djkauan", order: 0 },
            { platform: "tiktok", url: "https://tiktok.com/@djkauan", order: 1 },
          ],
        },
      },
    },
  });

  await prisma.proposal.createMany({
    data: [
      {
        userId: user.id,
        clientName: "Mariana Costa",
        clientEmail: "mariana@exemplo.com",
        eventType: "WEDDING",
        eventCity: "São Paulo, SP",
        guestCount: 180,
        suggestedFee: 2800,
        message: "Casamento em agosto, 6 horas de festa.",
        status: "NEW",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed concluído!");
  console.log("Login: djkauan@demo.com / demo1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
