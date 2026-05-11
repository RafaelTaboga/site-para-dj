"use client";
import { useState } from "react";
import { Check, Loader2, CreditCard, Clock, AlertTriangle, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";

const FEATURES = [
  "Site público profissional com domínio personalizado",
  "Propostas ilimitadas de clientes",
  "Secretária IA — análise automática de propostas",
  "Notificações por e-mail em tempo real",
  "Galeria de fotos e vídeos ilimitada",
  "Cor de destaque personalizável (neon theme)",
  "Links para redes sociais integrados",
  "Painel administrativo completo",
  "Suporte prioritário",
];

export function BillingClient({ subscription, trialDays, success, canceled }: any) {
  const [loading, setLoading] = useState(false);

  const isTrialing = subscription?.status === "TRIALING";
  const isActive = subscription?.status === "ACTIVE";
  const isBlocked = !isTrialing && !isActive;

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <div className="space-y-5">
      {success && (
        <div className="bg-green-950/40 border border-green-700/40 rounded-2xl p-5 flex items-center gap-3">
          <Check size={20} className="text-green-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-400">Assinatura ativada com sucesso! 🎉</p>
            <p className="text-sm text-green-400/70 mt-0.5">Seu site público está ativo e suas propostas já chegam com IA.</p>
          </div>
        </div>
      )}

      {canceled && (
        <div className="bg-yellow-950/30 border border-yellow-700/40 rounded-2xl p-5 flex items-center gap-3">
          <AlertTriangle size={20} className="text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-400 text-sm">Checkout cancelado. Você pode tentar novamente quando quiser.</p>
        </div>
      )}

      {/* Status card */}
      <div className={`rounded-2xl p-6 border ${isActive ? "bg-[var(--accent-10)] border-[var(--accent-30)]" : isTrialing ? "bg-blue-950/30 border-blue-700/40" : "bg-red-950/30 border-red-700/40"}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${isActive ? "text-[var(--accent)]" : isTrialing ? "text-blue-400" : "text-red-400"}`}>
              {isActive ? "✓ ATIVO" : isTrialing ? "⏳ TRIAL" : "🔒 BLOQUEADO"}
            </div>
            <p className="font-display text-xl font-bold">
              {isActive ? "Plano Pro Ativo" : isTrialing ? `${trialDays} dias de trial restantes` : "Assinatura Expirada"}
            </p>
            {subscription?.currentPeriodEnd && isActive && (
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Próxima cobrança: {formatDate(subscription.currentPeriodEnd)}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-bold">R$ 50</div>
            <div className="text-[var(--muted-foreground)] text-sm">/mês</div>
          </div>
        </div>

        {isTrialing && (
          <div className="mt-4 bg-black/20 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((7 - trialDays) / 7) * 100}%` }} />
          </div>
        )}
      </div>

      {/* Plan features */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
          <Zap size={18} className="text-[var(--accent)]" />
          Plano Pro — O que está incluído
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map(f => (
            <div key={f} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[var(--accent-10)] border border-[var(--accent-30)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={10} className="text-[var(--accent)]" />
              </div>
              <span className="text-sm text-[var(--muted-foreground)]">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {!isActive && (
        <button onClick={handleCheckout} disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[var(--accent)] text-black font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all glow text-base">
          {loading ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={20} />}
          {loading ? "Abrindo checkout..." : "Assinar Plano Pro — R$ 50/mês"}
        </button>
      )}

      {isTrialing && (
        <p className="text-center text-[var(--muted-foreground)] text-sm">
          Não cobramos durante o trial. O cartão só é debitado após os 7 dias.
        </p>
      )}
    </div>
  );
}
