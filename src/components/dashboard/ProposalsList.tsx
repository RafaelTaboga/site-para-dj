"use client";
import { useState } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp, Mail, Phone, MapPin, Users, Calendar, DollarSign } from "lucide-react";
import { formatCurrency, formatDate, EVENT_TYPE_LABELS } from "@/lib/utils";
import ReactMarkdown from "@/components/ui/markdown";

type Proposal = {
  id: string; clientName: string; clientEmail: string; clientPhone?: string | null;
  eventType: string; eventDate?: string | null; eventCity?: string | null; guestCount?: number | null;
  suggestedFee?: number | null; message: string; status: string; aiAnalysis?: string | null;
  createdAt: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  NEW: { label: "Nova", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  AI_ANALYZED: { label: "IA Analisou", color: "#00FF87", bg: "rgba(0,255,135,0.1)" },
  RESPONDED: { label: "Respondida", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  ACCEPTED: { label: "Fechado ✓", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  REJECTED: { label: "Recusada", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
};

export function ProposalsList({ initialProposals, hasAiConfig }: { initialProposals: Proposal[]; hasAiConfig: boolean }) {
  const [proposals, setProposals] = useState(initialProposals);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? proposals : proposals.filter(p => p.status === filter);

  async function analyzeProposal(proposalId: string) {
    setAnalyzingId(proposalId);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId }),
      });
      const data = await res.json();
      if (data.analysis) {
        setProposals(prev => prev.map(p =>
          p.id === proposalId ? { ...p, aiAnalysis: data.analysis, status: "AI_ANALYZED" } : p
        ));
        setExpandedId(proposalId);
      }
    } finally {
      setAnalyzingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "NEW", "AI_ANALYZED", "RESPONDED", "ACCEPTED"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent-30)] hover:text-white"
            }`}>
            {f === "ALL" ? `Todas (${proposals.length})` : STATUS_LABELS[f]?.label ?? f}
          </button>
        ))}
      </div>

      {!hasAiConfig && (
        <div className="bg-yellow-950/30 border border-yellow-700/40 rounded-xl px-5 py-4 text-sm text-yellow-400">
          💡 Configure seus parâmetros em{" "}
          <a href="/dashboard/ai-config" className="underline font-semibold">Config IA</a>{" "}
          para análises mais precisas da Secretária IA.
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[var(--muted-foreground)]">
          <Sparkles size={40} className="mx-auto mb-4 opacity-30" />
          <p>Nenhuma proposta aqui ainda.</p>
          <p className="text-sm mt-2">Quando clientes preencherem seu formulário público, elas aparecerão aqui.</p>
        </div>
      )}

      {filtered.map(p => {
        const st = STATUS_LABELS[p.status] ?? STATUS_LABELS.NEW;
        const isExpanded = expandedId === p.id;
        return (
          <div key={p.id}
            className="bg-[var(--card)] border rounded-2xl transition-all overflow-hidden"
            style={{ borderColor: isExpanded ? "var(--accent-30)" : "var(--border)" }}>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="font-display font-bold text-lg">{p.clientName}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                      style={{ color: st.color, background: st.bg, borderColor: st.color + "50" }}>
                      {st.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1.5"><Mail size={13} />{p.clientEmail}</span>
                    {p.clientPhone && <span className="flex items-center gap-1.5"><Phone size={13} />{p.clientPhone}</span>}
                    {p.eventCity && <span className="flex items-center gap-1.5"><MapPin size={13} />{p.eventCity}</span>}
                    {p.guestCount && <span className="flex items-center gap-1.5"><Users size={13} />{p.guestCount} pessoas</span>}
                    {p.eventDate && <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(p.eventDate)}</span>}
                    {p.suggestedFee && <span className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--accent)" }}><DollarSign size={13} />{formatCurrency(p.suggestedFee)}</span>}
                  </div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {EVENT_TYPE_LABELS[p.eventType]} · Recebida em {formatDate(p.createdAt)}
                  </div>
                </div>
                <button onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="p-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] transition-colors text-[var(--muted-foreground)] flex-shrink-0">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                {!p.aiAnalysis ? (
                  <button onClick={() => analyzeProposal(p.id)} disabled={analyzingId === p.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all disabled:opacity-50"
                    style={{ color: "var(--accent)", borderColor: "var(--accent-30)", background: "var(--accent-10)" }}>
                    {analyzingId === p.id
                      ? <><Loader2 size={14} className="animate-spin" /> Analisando...</>
                      : <><Sparkles size={14} /> Analisar com IA</>}
                  </button>
                ) : (
                  <button onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                    style={{ color: "var(--accent)", borderColor: "var(--accent-30)", background: "var(--accent-10)" }}>
                    <Sparkles size={14} /> {isExpanded ? "Ocultar análise" : "Ver análise da IA"}
                  </button>
                )}
                <a href={`mailto:${p.clientEmail}`}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-[var(--border)] text-[var(--muted-foreground)] hover:text-white hover:border-[var(--border-hover)] transition-all">
                  Responder
                </a>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-[var(--border)] p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Mensagem</p>
                  <p className="text-sm leading-relaxed bg-[var(--muted)] rounded-xl p-4 italic text-[var(--muted-foreground)]">"{p.message}"</p>
                </div>
                {p.aiAnalysis && (
                  <div className="rounded-xl p-5 border" style={{ background: "var(--accent-10)", borderColor: "var(--accent-30)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={16} style={{ color: "var(--accent)" }} />
                      <span className="font-display font-bold text-sm" style={{ color: "var(--accent)" }}>Análise da Secretária IA</span>
                    </div>
                    <ReactMarkdown>{p.aiAnalysis}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
