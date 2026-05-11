"use client";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-900/50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h1 className="font-display text-3xl font-black mb-3">Algo deu errado</h1>
        <p className="text-gray-400 mb-8">Ocorreu um erro inesperado. Tente novamente.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="inline-flex items-center gap-2 bg-[#00FF87] text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all">
            <RefreshCw size={16} /> Tentar novamente
          </button>
          <Link href="/" className="inline-flex items-center gap-2 border border-[#1e1e30] text-gray-400 px-6 py-3 rounded-xl hover:text-white transition-all">
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
