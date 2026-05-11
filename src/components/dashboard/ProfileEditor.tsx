"use client";
import { useState } from "react";
import { Save, Loader2, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { SOCIAL_PLATFORMS } from "@/lib/utils";

const ACCENT_PRESETS = ["#00FF87", "#00D4FF", "#FF006E", "#FFB800", "#BF00FF", "#FF4500"];

export function ProfileEditor({ profile, socialLinks, slug }: any) {
  const [form, setForm] = useState({
    artistName: profile?.artistName ?? "",
    tagline: profile?.tagline ?? "",
    bio: profile?.bio ?? "",
    accentColor: profile?.accentColor ?? "#00FF87",
    baseCity: profile?.baseCity ?? "",
    whatsappNumber: profile?.whatsappNumber ?? "",
    totalShows: profile?.totalShows ?? "",
    yearsExperience: profile?.yearsExperience ?? "",
    citiesCovered: profile?.citiesCovered ?? "",
    isPublished: profile?.isPublished ?? false,
  });
  const [links, setLinks] = useState(socialLinks ?? []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: string) => (e: any) =>
    setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function save() {
    setSaving(true);
    await Promise.all([
      fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalShows: form.totalShows ? +form.totalShows : null, yearsExperience: form.yearsExperience ? +form.yearsExperience : null, citiesCovered: form.citiesCovered ? +form.citiesCovered : null }) }),
      fetch("/api/social-links", { method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(links.filter((l: any) => l.url)) }),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Publish toggle */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <div className="font-semibold flex items-center gap-2">
            {form.isPublished ? <Eye size={16} className="text-[var(--accent)]" /> : <EyeOff size={16} className="text-[var(--muted-foreground)]" />}
            Site {form.isPublished ? "Público — Visível" : "Oculto"}
          </div>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">
            {form.isPublished ? `Acessível em /${slug}` : "Ninguém consegue ver seu site ainda"}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only" checked={form.isPublished} onChange={set("isPublished")} />
          <div className={`w-12 h-6 rounded-full transition-all ${form.isPublished ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${form.isPublished ? "left-6" : "left-0.5"}`} />
          </div>
        </label>
      </div>

      {/* Accent color */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
        <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-4">Cor de Destaque (Neon)</label>
        <div className="flex items-center gap-3 flex-wrap">
          {ACCENT_PRESETS.map(c => (
            <button key={c} onClick={() => setForm(f => ({ ...f, accentColor: c }))}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{ background: c, borderColor: form.accentColor === c ? "#fff" : "transparent", boxShadow: form.accentColor === c ? `0 0 12px ${c}80` : "none" }} />
          ))}
          <div className="flex items-center gap-2 ml-2">
            <input type="color" value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
              className="w-10 h-8 rounded cursor-pointer bg-transparent border-0" />
            <input value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
              className="bg-[var(--muted)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-mono w-28 outline-none" />
          </div>
          <div className="w-8 h-8 rounded-full" style={{ background: form.accentColor, boxShadow: `0 0 16px ${form.accentColor}80` }} />
        </div>
      </div>

      {/* Main info */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-bold text-lg">Informações Principais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Nome Artístico", key: "artistName", placeholder: "DJ Kauan" },
            { label: "Tagline", key: "tagline", placeholder: "O som que transforma sua festa" },
            { label: "Cidade Base", key: "baseCity", placeholder: "São Paulo, SP" },
            { label: "WhatsApp", key: "whatsappNumber", placeholder: "+55 11 99999-0000" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={set(f.key)} placeholder={f.placeholder}
                className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Biografia</label>
            <textarea value={form.bio} onChange={set("bio")} rows={4}
              placeholder="Conte sua história, estilo musical, experiências..."
              className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all resize-none" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg mb-4">Estatísticas do Site</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Shows Realizados", key: "totalShows", placeholder: "200" },
            { label: "Anos de Experiência", key: "yearsExperience", placeholder: "10" },
            { label: "Cidades Atendidas", key: "citiesCovered", placeholder: "15" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">{f.label}</label>
              <input type="number" value={(form as any)[f.key]} onChange={set(f.key)} placeholder={f.placeholder}
                className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">Redes Sociais</h2>
          <button onClick={() => setLinks((l: any) => [...l, { platform: "instagram", url: "" }])}
            className="flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline">
            <Plus size={14} /> Adicionar
          </button>
        </div>
        <div className="space-y-3">
          {links.map((link: any, i: number) => (
            <div key={i} className="flex gap-3">
              <select value={link.platform} onChange={e => setLinks((l: any) => l.map((ll: any, ii: number) => ii === i ? { ...ll, platform: e.target.value } : ll))}
                className="bg-[var(--muted)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-all w-40">
                {SOCIAL_PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <input value={link.url} onChange={e => setLinks((l: any) => l.map((ll: any, ii: number) => ii === i ? { ...ll, url: e.target.value } : ll))}
                placeholder={SOCIAL_PLATFORMS.find(p => p.id === link.platform)?.placeholder ?? "URL"}
                className="flex-1 bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--accent)] transition-all" />
              <button onClick={() => setLinks((l: any) => l.filter((_: any, ii: number) => ii !== i))}
                className="p-2 text-[var(--muted-foreground)] hover:text-red-400 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 bg-[var(--accent)] text-black font-bold px-8 py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all glow text-sm">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saved ? "Salvo com sucesso! ✓" : "Salvar Alterações"}
      </button>
    </div>
  );
}
