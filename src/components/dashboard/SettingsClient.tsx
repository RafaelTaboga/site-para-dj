"use client";
import { useState } from "react";
import { Save, Loader2, User, Lock, Globe, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";

export function SettingsClient({ user }: { user: any }) {
  const [nameForm, setNameForm] = useState({ name: user.name });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingName, setSavingName] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameForm.name }),
    });
    setSavingName(false);
    if (res.ok) toast("Nome atualizado!", "success");
    else toast("Erro ao salvar", "error");
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast("As senhas não conferem", "error"); return;
    }
    if (pwForm.newPassword.length < 8) {
      toast("Senha deve ter mínimo 8 caracteres", "error"); return;
    }
    setSavingPw(true);
    const res = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    });
    setSavingPw(false);
    if (res.ok) {
      toast("Senha alterada com sucesso!", "success");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      const d = await res.json();
      toast(d.error ?? "Erro ao alterar senha", "error");
    }
  }

  const inputCls = "w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted-foreground)]";
  const labelCls = "block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2";

  const Section = ({ icon: Icon, title, children }: any) => (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
      <h2 className="font-display font-bold text-lg flex items-center gap-2">
        <Icon size={18} className="text-[var(--accent)]" />{title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Account info */}
      <Section icon={User} title="Dados da Conta">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[var(--muted-foreground)]">E-mail</span>
            <p className="font-medium mt-1">{user.email}</p>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)]">Membro desde</span>
            <p className="font-medium mt-1">{formatDate(user.createdAt)}</p>
          </div>
        </div>
        <form onSubmit={saveName} className="space-y-4">
          <div>
            <label className={labelCls}>Nome completo</label>
            <input value={nameForm.name} onChange={e => setNameForm({ name: e.target.value })} className={inputCls} />
          </div>
          <button type="submit" disabled={savingName}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-black text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all">
            {savingName ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salvar Nome
          </button>
        </form>
      </Section>

      {/* URL pública */}
      <Section icon={Globe} title="URL do Seu Site">
        <div className="bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-[var(--muted-foreground)] text-sm">Seu link público:</span>
            <p className="font-mono font-semibold text-[var(--accent)] mt-0.5">{process.env.NEXT_PUBLIC_APP_URL}/{user.slug}</p>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/${user.slug}`); toast("Link copiado!", "success"); }}
            className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--muted-foreground)] hover:text-white transition-colors">
            Copiar
          </button>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">O slug não pode ser alterado após o cadastro.</p>
      </Section>

      {/* Change password */}
      <Section icon={Lock} title="Alterar Senha">
        <form onSubmit={savePassword} className="space-y-4">
          {[
            { label: "Senha atual", key: "currentPassword" },
            { label: "Nova senha (mín. 8 caracteres)", key: "newPassword" },
            { label: "Confirmar nova senha", key: "confirmPassword" },
          ].map(f => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input type="password" value={(pwForm as any)[f.key]}
                onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                className={inputCls} placeholder="••••••••" />
            </div>
          ))}
          <button type="submit" disabled={savingPw}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--muted)] border border-[var(--border)] text-sm font-bold rounded-xl hover:border-[var(--accent-30)] hover:text-[var(--accent)] disabled:opacity-50 transition-all">
            {savingPw ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            Alterar Senha
          </button>
        </form>
      </Section>

      {/* Danger zone */}
      <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg flex items-center gap-2 text-red-400 mb-3">
          <AlertTriangle size={18} /> Zona de Perigo
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Excluir sua conta remove permanentemente todos os dados, site público e propostas. Esta ação não pode ser desfeita.
        </p>
        <button className="px-5 py-2.5 bg-red-950/50 border border-red-800/50 text-red-400 text-sm font-bold rounded-xl hover:bg-red-900/40 transition-all">
          Excluir minha conta
        </button>
      </div>
    </div>
  );
}
