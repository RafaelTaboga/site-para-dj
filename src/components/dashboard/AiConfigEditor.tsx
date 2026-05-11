"use client";
import { useState } from "react";
import { Save, Loader2, Bot, DollarSign, MapPin, Wrench, FileText } from "lucide-react";

const EVENT_TYPES = [
  { value: "WEDDING", label: "💍 Casamento" },
  { value: "CORPORATE", label: "🏢 Corporativo" },
  { value: "BIRTHDAY", label: "🎂 Aniversário" },
  { value: "UNIVERSITY", label: "🎓 Formatura" },
  { value: "NIGHTCLUB", label: "🎉 Balada" },
  { value: "FESTIVAL", label: "🎪 Festival" },
];

export function AiConfigEditor({ config }: { config: any }) {
  const [form, setForm] = useState({
    minimumFee: config?.minimumFee ?? "",
    preferredFee: config?.preferredFee ?? "",
    maxDistanceKm: config?.maxDistanceKm ?? "",
    distanceFeePerKm: config?.distanceFeePerKm ?? "",
    hasOwnEquipment: config?.hasOwnEquipment ?? true,
    equipmentNotes: config?.equipmentNotes ?? "",
    customInstructions: config?.customInstructions ?? "",
    preferredEventTypes: config?.preferredEventTypes ?? [],
    avoidEventTypes: config?.avoidEventTypes ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: string) => (e: any) =>
    setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const toggleType = (key: "preferredEventTypes" | "avoidEventTypes", val: string) => {
    setForm(f => ({
      ...f,
      [key]: (f[key] as string[]).includes(val)
        ? (f[key] as string[]).filter(v => v !== val)
        : [...(f[key] as string[]), val],
    }));
  };

  async function save() {
    setSaving(true);
    await fetch("/api/ai-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        minimumFee: form.minimumFee ? +form.minimumFee : null,
        preferredFee: form.preferredFee ? +form.preferredFee : null,
        maxDistanceKm: form.maxDistanceKm ? +form.maxDistanceKm : null,
        distanceFeePerKm: form.distanceFeePerKm ? +form.distanceFeePerKm : null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const Section = ({ icon: Icon, title, children }: any) => (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
      <h2 className="font-display font-bold text-lg flex items-center gap-2">
        <Icon size={18} className="text-[var(--accent)]" />
        {title}
      </h2>
      {children}
    </div>
  );

  const Field = ({ label, children }: any) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">{label}</label>
      {children}
    </div>
  );

  const Input = ({ k, ...props }: any) => (
    <input value={form[k as keyof typeof form] as string} onChange={set(k)} {...props}
      className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted-foreground)]" />
  );

  return (
    <div className="space-y-5">
      <div className="bg-[var(--accent-10)] border border-[var(--accent-30)] rounded-2xl p-5 flex gap-3">
        <Bot size={20} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          A secretária IA usa esses parâmetros para analisar cada proposta recebida e te dar recomendações personalizadas.
          Quanto mais completo, mais precisa a análise.
        </p>
      </div>

      <Section icon={DollarSign} title="Cachê e Valores">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Cachê Mínimo (R$)"><Input k="minimumFee" type="number" placeholder="1500" /></Field>
          <Field label="Cachê Ideal (R$)"><Input k="preferredFee" type="number" placeholder="3000" /></Field>
        </div>
      </Section>

      <Section icon={MapPin} title="Deslocamento e Logística">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Distância máxima sem taxa (km)"><Input k="maxDistanceKm" type="number" placeholder="80" /></Field>
          <Field label="Taxa de deslocamento (R$/km)"><Input k="distanceFeePerKm" type="number" step="0.5" placeholder="2.00" /></Field>
        </div>
      </Section>

      <Section icon={Wrench} title="Equipamento">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only" checked={form.hasOwnEquipment} onChange={set("hasOwnEquipment")} />
            <div className={`w-12 h-6 rounded-full transition-all ${form.hasOwnEquipment ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${form.hasOwnEquipment ? "left-6" : "left-0.5"}`} />
            </div>
          </label>
          <span className="text-sm">Tenho equipamento próprio</span>
        </div>
        <Field label="Notas sobre equipamento">
          <textarea value={form.equipmentNotes} onChange={set("equipmentNotes")} rows={2}
            placeholder="Ex: Tenho caixas até 2000W. Eventos maiores precisam locar sistema de som."
            className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all resize-none placeholder:text-[var(--muted-foreground)]" />
        </Field>
      </Section>

      <Section icon={Bot} title="Preferências de Eventos">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Prefiro tocar em:</p>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map(t => (
                <button key={t.value} onClick={() => toggleType("preferredEventTypes", t.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    (form.preferredEventTypes as string[]).includes(t.value)
                      ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent-30)]"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Evito:</p>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map(t => (
                <button key={t.value} onClick={() => toggleType("avoidEventTypes", t.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    (form.avoidEventTypes as string[]).includes(t.value)
                      ? "bg-red-900 text-red-300 border-red-700"
                      : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-red-700/40"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section icon={FileText} title="Instruções Especiais para IA">
        <Field label="Instruções livres (a IA seguirá à risca)">
          <textarea value={form.customInstructions} onChange={set("customInstructions")} rows={4}
            placeholder={'Ex: "Sempre cobro 50% de sinal antecipado. Não aceito eventos de menos de 4 horas. Prefiro não tocar pagode."'}
            className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all resize-none placeholder:text-[var(--muted-foreground)]" />
        </Field>
      </Section>

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 bg-[var(--accent)] text-black font-bold px-8 py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all glow text-sm">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saved ? "Configurações salvas! ✓" : "Salvar Configurações"}
      </button>
    </div>
  );
}
