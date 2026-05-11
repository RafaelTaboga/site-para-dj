import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AiConfigEditor } from "@/components/dashboard/AiConfigEditor";

export default async function AiConfigPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const config = await prisma.aiConfig.findUnique({ where: { userId: session.user.id } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Configurar Secretária IA</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Esses parâmetros definem como a IA analisa suas propostas.
        </p>
      </div>
      <AiConfigEditor config={config as any} />
    </div>
  );
}
