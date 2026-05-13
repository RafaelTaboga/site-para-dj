import { prisma } from "@/lib/prisma";

export type AccessLevel = "full" | "trial" | "blocked";

export async function getUserAccessLevel(userId: string): Promise<AccessLevel> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) return "blocked";
  if (subscription.status === "ACTIVE") return "full";

  if (subscription.status === "TRIALING") {
    return new Date() < subscription.trialEndsAt ? "trial" : "blocked";
  }

  if (subscription.status === "PAST_DUE") {
    const gracePeriodEnd = new Date(subscription.currentPeriodEnd!);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3);
    return new Date() < gracePeriodEnd ? "trial" : "blocked";
  }

  return "blocked";
}

export function getTrialDaysRemaining(trialEndsAt: Date): number {
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function isSubscriptionActive(status: string): boolean {
  return ["ACTIVE", "TRIALING"].includes(status);
}
