"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Music2, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email, password, redirect: false,
    });
    if (result?.error) {
      setError("E-mail ou senha incorretos");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen grid-bg noise flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-radial from-[var(--accent-10)] via-transparent to-transparent pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-10)] border border-[var(--accent-30)] mb-4 glow">
            <Music2 className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Site para DJ</h1>
          <p className="text-[var(--muted-foreground)] mt-2 text-sm">Acesse seu painel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">E-mail</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-30)] transition-all placeholder:text-[var(--muted-foreground)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-30)] transition-all placeholder:text-[var(--muted-foreground)]"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-white transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-black font-bold rounded-xl py-3.5 hover:opacity-90 disabled:opacity-50 transition-all glow text-sm">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Entrar <ArrowRight size={16} /></>}
          </button>

          <p className="text-center text-[var(--muted-foreground)] text-sm mt-6">
            Não tem conta?{" "}
            <Link href="/register" className="text-[var(--accent)] hover:underline font-medium">
              Comece grátis por 7 dias
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
