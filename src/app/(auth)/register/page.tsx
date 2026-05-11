"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Music2, Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", artistName: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }

      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/dashboard");
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
      setLoading(false);
    }
  }

  const perks = ["7 dias de trial grátis", "Site público profissional", "Secretária IA incluída", "Cancelável a qualquer momento"];

  return (
    <div className="min-h-screen grid-bg noise flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-radial from-[var(--accent-10)] via-transparent to-transparent pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-10)] border border-[var(--accent-30)] mb-4 glow">
            <Music2 className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Crie seu site de DJ</h1>
          <p className="text-[var(--muted-foreground)] mt-2 text-sm">7 dias grátis, sem cartão de crédito</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {perks.map(p => (
            <div key={p} className="flex items-center gap-2 bg-[var(--accent-10)] border border-[var(--accent-30)] rounded-lg px-3 py-2">
              <Check size={12} className="text-[var(--accent)] flex-shrink-0" />
              <span className="text-xs text-[var(--muted-foreground)]">{p}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            {[
              { label: "Nome Artístico (será seu slug)", key: "artistName", placeholder: "Ex: DJ Kauan", type: "text" },
              { label: "Seu nome completo", key: "name", placeholder: "Nome e Sobrenome", type: "text" },
              { label: "E-mail", key: "email", placeholder: "seu@email.com", type: "email" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">{f.label}</label>
                <input
                  type={f.type} required value={(form as any)[f.key]} onChange={set(f.key)}
                  placeholder={f.placeholder}
                  className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-30)] transition-all placeholder:text-[var(--muted-foreground)]"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Senha (mín. 8 caracteres)</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required minLength={8} value={form.password} onChange={set("password")}
                  placeholder="••••••••"
                  className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-30)] transition-all placeholder:text-[var(--muted-foreground)]"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-white">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-black font-bold rounded-xl py-3.5 hover:opacity-90 disabled:opacity-50 transition-all glow text-sm">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Criar minha conta grátis <ArrowRight size={16} /></>}
          </button>

          <p className="text-center text-[var(--muted-foreground)] text-sm mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">Fazer login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
