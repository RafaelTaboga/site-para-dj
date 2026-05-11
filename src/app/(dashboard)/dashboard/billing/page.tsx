import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTrialDaysRemaining } from "@/lib/subscription";
import { BillingClient } from "@/components/dashboard/BillingClient";

export default async function BillingPage({ searchParams }: { searchParams: { success?: string; canceled?: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  const trialDays = subscription?.trialEndsAt ? getTrialDaysRemaining(subscription.trialEndsAt) : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Assinatura</h1>
      <BillingClient
        subscription={subscription as any}
        trialDays={trialDays}
        success={searchParams.success === "true"}
        canceled={searchParams.canceled === "true"}
      />
    </div>
  );
}
