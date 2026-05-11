import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/dashboard/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, slug: true, createdAt: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Configurações da Conta</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Gerencie seus dados pessoais e preferências.</p>
      </div>
      <SettingsClient user={user as any} />
    </div>
  );
}
