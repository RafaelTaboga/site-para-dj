import Link from "next/link";
import { Music2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-[#00FF8715] border border-[#00FF8730] flex items-center justify-center mx-auto mb-6">
          <Music2 size={32} className="text-[#00FF87]" />
        </div>
        <h1 className="font-display text-5xl font-black mb-3">404</h1>
        <p className="text-gray-400 mb-8">Essa página não existe ou o DJ ainda não ativou seu site.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#00FF87] text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all">
          <ArrowLeft size={16} /> Voltar ao início
        </Link>
      </div>
    </div>
  );
}
