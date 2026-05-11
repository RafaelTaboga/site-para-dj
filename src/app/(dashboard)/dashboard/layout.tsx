import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { getTrialDaysRemaining } from "@/lib/subscription";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true, profile: true },
  });
  if (!user) redirect("/login");

  const trialDays = user.subscription?.trialEndsAt
    ? getTrialDaysRemaining(user.subscription.trialEndsAt)
    : 0;

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      <DashboardSidebar
        user={{ name: user.name, email: user.email, slug: user.slug }}
        profile={user.profile}
        subscription={user.subscription}
        trialDays={trialDays}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
