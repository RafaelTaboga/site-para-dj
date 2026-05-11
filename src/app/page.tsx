import Link from "next/link";
import { Music2, Sparkles, Globe, Mail, CreditCard, ArrowRight, Check } from "lucide-react";

const FEATURES = [
  { icon: Globe, title: "Site Profissional", desc: "Dark mode premium com sua cor neon. Domínio personalizado. Online em minutos." },
  { icon: Mail, title: "Propostas por E-mail", desc: "Cada contato do site vira uma proposta organizada no seu painel com notificação automática." },
  { icon: Sparkles, title: "Secretária IA", desc: "A IA analisa cada proposta, cruzando com seu cachê mínimo e logística, e recomenda como responder." },
  { icon: CreditCard, title: "R$ 50/mês", desc: "7 dias grátis sem cartão. Assine só se gostar. Cancele quando quiser." },
];

const PLANS = [
  "Site público com URL personalizada",
  "Propostas ilimitadas",
  "Secretária IA incluída",
  "Notificações por e-mail",
  "Galeria de fotos/vídeos",
  "Links para redes sociais",
  "Painel administrativo",
  "Cor de destaque customizável",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white font-body overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[#1e1e30] bg-[#080810]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00FF8720] border border-[#00FF8740] flex items-center justify-center">
              <Music2 size={15} className="text-[#00FF87]" />
            </div>
            <span className="font-display font-bold text-lg">Site para DJ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Entrar</Link>
            <Link href="/register" className="flex items-center gap-1.5 bg-[#00FF87] text-black text-sm font-bold px-5 py-2 rounded-full hover:opacity-90 transition-all" style={{ boxShadow: "0 0 20px #00FF8740" }}>
              Começar grátis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15 blur-3xl"
            style={{ background: "radial-gradient(circle, #00FF87, transparent 60%)" }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#00FF8715] border border-[#00FF8730] rounded-full px-4 py-1.5 text-sm text-[#00FF87] font-medium mb-8">
            <Sparkles size={13} /> 7 dias grátis · Sem cartão de crédito
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-6">
            Seu site de DJ
            <br />
            <span style={{ color: "#00FF87", textShadow: "0 0 60px #00FF8740" }}>profissional</span>
            <br />
            em minutos.
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Crie seu portfólio, receba propostas de clientes e deixe a IA analisar cada evento para você — tudo em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register"
              className="flex items-center gap-2 font-display font-bold text-black px-10 py-4 rounded-full text-lg hover:opacity-90 transition-all"
              style={{ background: "#00FF87", boxShadow: "0 0 40px #00FF8750, 0 0 80px #00FF8720" }}>
              Criar meu site grátis <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
              Já tenho conta →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-black tracking-tight mb-4">Tudo que você precisa</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Uma plataforma completa para DJs que levam o negócio a sério.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-[#0f0f1a] border border-[#1e1e30] hover:border-[#00FF8730] rounded-2xl p-7 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#00FF8715] border border-[#00FF8730] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon size={20} className="text-[#00FF87]" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-black tracking-tight mb-4">Simples assim.</h2>
            <p className="text-gray-400">Um plano. Tudo incluído.</p>
          </div>
          <div className="bg-[#0f0f1a] border border-[#00FF8740] rounded-3xl p-8 relative overflow-hidden" style={{ boxShadow: "0 0 60px #00FF8715" }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: "#00FF87" }} />
            <div className="relative z-10">
              <div className="flex items-end gap-2 mb-2">
                <span className="font-display text-6xl font-black">R$ 50</span>
                <span className="text-gray-400 mb-3">/mês</span>
              </div>
              <p className="text-[#00FF87] text-sm font-semibold mb-6">7 dias grátis para experimentar</p>
              <div className="space-y-3 mb-8">
                {PLANS.map(p => (
                  <div key={p} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#00FF8720] border border-[#00FF8440] flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-[#00FF87]" />
                    </div>
                    <span className="text-gray-300">{p}</span>
                  </div>
                ))}
              </div>
              <Link href="/register"
                className="block text-center font-display font-bold text-black py-4 rounded-2xl hover:opacity-90 transition-all text-base"
                style={{ background: "#00FF87", boxShadow: "0 0 30px #00FF8740" }}>
                Começar 7 dias grátis
              </Link>
              <p className="text-center text-gray-600 text-xs mt-4">Sem cartão. Cancele quando quiser.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e30] py-10 text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Site para DJ · Feito para artistas que crescem
        </p>
      </footer>
    </div>
  );
}
