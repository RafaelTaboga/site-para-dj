"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Instagram, Youtube, Music, ExternalLink, Send, Loader2, Check, Phone, MessageCircle } from "lucide-react";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  tiktok: ExternalLink,
  youtube: Youtube,
  spotify: Music,
  soundcloud: Music,
};

const EVENT_OPTIONS = [
  "Casamento", "Corporativo", "Aniversário / Debutante",
  "Formatura", "Balada / Casa Noturna", "Festival", "Outro",
];

export function PublicDjSite({ dj }: { dj: any }) {
  const { profile, socialLinks, mediaItems } = dj;
  const accent = profile.accentColor ?? "#00FF87";

  // Inject CSS variable for accent color
  useEffect(() => {
    document.documentElement.style.setProperty("--dj-accent", accent);
    document.documentElement.style.setProperty("--dj-accent-30", accent + "4D");
    document.documentElement.style.setProperty("--dj-accent-20", accent + "33");
    document.documentElement.style.setProperty("--dj-accent-10", accent + "1A");
  }, [accent]);

  const [formState, setFormState] = useState({
    clientName: "", clientEmail: "", clientPhone: "",
    eventType: "", eventDate: "", eventCity: "", guestCount: "", suggestedFee: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const contactRef = useRef<HTMLDivElement>(null);
  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ djSlug: dj.slug, ...formState }),
      });
      if (res.ok) setSubmitted(true);
      else setFormError("Erro ao enviar. Tente novamente.");
    } catch {
      setFormError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const stats = [
    profile.totalShows && { value: `${profile.totalShows}+`, label: "Shows" },
    profile.yearsExperience && { value: profile.yearsExperience, label: "Anos" },
    profile.citiesCovered && { value: profile.citiesCovered, label: "Cidades" },
  ].filter(Boolean);

  return (
    <div style={{ "--accent": accent, "--accent-30": accent + "4D", "--accent-10": accent + "1A" } as any}
      className="min-h-screen bg-[#080810] text-white font-body overflow-x-hidden">

      {/* Floating WhatsApp */}
      {profile.whatsappNumber && (
        <a href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}`}
          target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
          style={{ background: "#25D366", boxShadow: "0 0 30px #25D36660" }}>
          <MessageCircle size={24} fill="white" />
        </a>
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 grid-bg noise">
        {/* Glow orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
            style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-scan-line" />
        </div>

        <div className="relative z-10 animate-fade-in">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full mx-auto mb-8 border-2 overflow-hidden flex items-center justify-center text-5xl"
            style={{ borderColor: accent, boxShadow: `0 0 40px ${accent}40` }}>
            {profile.avatarUrl ? (
              <Image src={profile.avatarUrl} alt={profile.artistName} width={128} height={128} className="object-cover w-full h-full" />
            ) : "🎧"}
          </div>

          {/* Name */}
          <h1 className="font-display text-6xl sm:text-8xl font-black tracking-tighter mb-4 leading-none"
            style={{ textShadow: `0 0 60px ${accent}40` }}>
            {profile.artistName}
          </h1>

          {profile.tagline && (
            <p className="text-lg sm:text-xl text-gray-400 mb-6 max-w-lg mx-auto">{profile.tagline}</p>
          )}

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-4 mb-10">
              {socialLinks.map((link: any) => {
                const Icon = SOCIAL_ICONS[link.platform] ?? ExternalLink;
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110"
                    style={{ borderColor: accent + "50", color: accent, background: accent + "15" }}>
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          )}

          <button onClick={scrollToContact}
            className="inline-flex items-center gap-2 font-display font-bold text-black px-10 py-4 rounded-full text-lg transition-all hover:scale-105"
            style={{ background: accent, boxShadow: `0 0 40px ${accent}50, 0 0 80px ${accent}20` }}>
            Contratar DJ
            <Send size={18} />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border-2 rounded-full flex items-start justify-center pt-1.5"
            style={{ borderColor: accent + "60" }}>
            <div className="w-1 h-2 rounded-full" style={{ background: accent }} />
          </div>
        </div>
      </section>

      {/* STATS */}
      {stats.length > 0 && (
        <section className="py-16 border-y border-[#1e1e30]">
          <div className="max-w-4xl mx-auto px-6 flex justify-center">
            <div className="flex divide-x divide-[#1e1e30]">
              {stats.map((s: any) => (
                <div key={s.label} className="px-12 text-center">
                  <div className="font-display text-5xl font-black" style={{ color: accent }}>{s.value}</div>
                  <div className="text-gray-500 text-sm mt-1 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BIO */}
      {profile.bio && (
        <section className="py-24 max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl font-black mb-8" style={{ color: accent }}>Sobre Mim</h2>
          <p className="text-gray-300 text-lg leading-relaxed">{profile.bio}</p>
          {profile.baseCity && (
            <div className="mt-6 inline-flex items-center gap-2 text-gray-500 text-sm">
              📍 Base: {profile.baseCity}
            </div>
          )}
        </section>
      )}

      {/* GALLERY */}
      {mediaItems.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-6">
          <h2 className="font-display text-4xl font-black text-center mb-12" style={{ color: accent }}>Galeria</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {mediaItems.map((item: any, i: number) => (
              <div key={item.id}
                className={`relative overflow-hidden rounded-xl bg-[#111] group ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                style={{ aspectRatio: i === 0 ? "1/1" : "1/1" }}>
                <Image src={item.url} alt={item.caption ?? ""} fill className="object-cover transition-transform group-hover:scale-105 duration-500" />
                {item.caption && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-sm font-medium">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT FORM */}
      <section ref={contactRef} className="py-24 max-w-2xl mx-auto px-6" id="contato">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-black mb-4" style={{ color: accent }}>Solicitar Proposta</h2>
          <p className="text-gray-400">Preencha o formulário e receba um retorno em até 24 horas.</p>
        </div>

        {submitted ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: accent + "0D", borderColor: accent + "40" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: accent + "20", border: `2px solid ${accent}` }}>
              <Check size={28} style={{ color: accent }} />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2" style={{ color: accent }}>Proposta Enviada!</h3>
            <p className="text-gray-400">{profile.artistName} foi notificado e entrará em contato em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0f0f1a] border border-[#1e1e30] rounded-2xl p-8 space-y-5">
            {formError && (
              <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-xl text-red-400 text-sm text-center">{formError}</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Seu Nome *", key: "clientName", placeholder: "Maria Silva", required: true, colSpan: 1 },
                { label: "E-mail *", key: "clientEmail", type: "email", placeholder: "maria@email.com", required: true, colSpan: 1 },
                { label: "WhatsApp", key: "clientPhone", placeholder: "+55 11 99999-9999", colSpan: 1 },
                { label: "Cidade do Evento", key: "eventCity", placeholder: "São Paulo, SP", colSpan: 1 },
                { label: "Data do Evento", key: "eventDate", type: "date", colSpan: 1 },
                { label: "Nº de Convidados (aprox.)", key: "guestCount", type: "number", placeholder: "150", colSpan: 1 },
              ].map(f => (
                <div key={f.key} className={f.colSpan === 2 ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">{f.label}</label>
                  <input
                    type={f.type ?? "text"} required={f.required}
                    value={(formState as any)[f.key]}
                    onChange={e => setFormState(s => ({ ...s, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-[#0a0a14] border border-[#1e1e30] rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-600"
                    style={{ focusBorderColor: accent } as any}
                    onFocus={e => e.target.style.borderColor = accent}
                    onBlur={e => e.target.style.borderColor = "#1e1e30"}
                  />
                </div>
              ))}

              <div className="col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Tipo de Evento *</label>
                <select required value={formState.eventType} onChange={e => setFormState(s => ({ ...s, eventType: e.target.value }))}
                  className="w-full bg-[#0a0a14] border border-[#1e1e30] rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = "#1e1e30"}>
                  <option value="">Selecione o tipo de evento...</option>
                  {EVENT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Detalhes e Mensagem *</label>
                <textarea required rows={4} value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  placeholder="Conte mais sobre o evento, local, horário, equipamento disponível no espaço, cachê esperado..."
                  className="w-full bg-[#0a0a14] border border-[#1e1e30] rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all placeholder:text-gray-600"
                  onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = "#1e1e30"} />
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 font-display font-bold text-black py-4 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 text-base"
              style={{ background: accent, boxShadow: `0 0 30px ${accent}40` }}>
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {submitting ? "Enviando..." : "Enviar Proposta"}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-[#1e1e30] text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} {profile.artistName}. Site criado com{" "}
          <a href="/" className="hover:underline" style={{ color: accent }}>Site para DJ</a>
        </p>
      </footer>
    </div>
  );
}
