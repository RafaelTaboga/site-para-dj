import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProposalsList } from "@/components/dashboard/ProposalsList";

export default async function ProposalsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const proposals = await prisma.proposal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const aiConfig = await prisma.aiConfig.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Propostas</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          {proposals.length} proposta{proposals.length !== 1 ? "s" : ""} recebida{proposals.length !== 1 ? "s" : ""}
          {proposals.filter(p => p.status === "NEW").length > 0 &&
            ` · ${proposals.filter(p => p.status === "NEW").length} nova${proposals.filter(p => p.status === "NEW").length !== 1 ? "s" : ""}`
          }
        </p>
      </div>
      <ProposalsList initialProposals={proposals as any} hasAiConfig={!!aiConfig?.minimumFee} />
    </div>
  );
}
