import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, Inbox, Eye, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [profile, proposalStats] = await Promise.all([
    prisma.djProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.proposal.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: true,
    }),
  ]);

  const recentProposals = await prisma.proposal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalProposals = proposalStats.reduce((a, b) => a + b._count, 0);
  const newCount = proposalStats.find(s => s.status === "NEW")?._count ?? 0;
  const acceptedCount = proposalStats.find(s => s.status === "ACCEPTED")?._count ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Olá, {profile?.artistName ?? session.user.name}! 👋
        </h1>
        <p className="text-[var(--muted-foreground)] mt-1">Aqui está o resumo do seu painel.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Propostas Totais", value: totalProposals, icon: Inbox, color: "#3B82F6" },
          { label: "Novas / Não lidas", value: newCount, icon: Sparkles, color: "var(--accent)" },
          { label: "Contratos Fechados", value: acceptedCount, icon: BarChart3, color: "#10B981" },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--muted-foreground)] text-sm">{stat.label}</span>
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <div className="font-display text-4xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/profile" className="group bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent-30)] rounded-2xl p-6 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Eye size={16} className="text-[var(--accent)]" />
                <span className="font-semibold">Editar Site Público</span>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm">Customize cores, bio e galeria</p>
            </div>
            <ArrowRight size={18} className="text-[var(--muted-foreground)] group-hover:text-[var(--accent)] transition-colors" />
          </div>
        </Link>
        <Link href="/dashboard/proposals" className="group bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent-30)] rounded-2xl p-6 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-[var(--accent)]" />
                <span className="font-semibold">Propostas com IA</span>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm">{newCount} novas esperando análise</p>
            </div>
            <ArrowRight size={18} className="text-[var(--muted-foreground)] group-hover:text-[var(--accent)] transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent proposals */}
      {recentProposals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Propostas Recentes</h2>
            <Link href="/dashboard/proposals" className="text-[var(--accent)] text-sm hover:underline">Ver todas →</Link>
          </div>
          <div className="space-y-3">
            {recentProposals.map(p => (
              <div key={p.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <span className="font-medium">{p.clientName}</span>
                  <span className="text-[var(--muted-foreground)] text-sm ml-3">{p.eventCity}</span>
                </div>
                <div className="flex items-center gap-4">
                  {p.suggestedFee && (
                    <span className="text-[var(--accent)] font-semibold text-sm">{formatCurrency(p.suggestedFee)}</span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${p.status === "NEW" ? "bg-blue-900/40 text-blue-400" : "bg-[var(--accent-10)] text-[var(--accent)]"}`}>
                    {p.status === "NEW" ? "Nova" : p.status === "AI_ANALYZED" ? "IA Analisou" : p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
