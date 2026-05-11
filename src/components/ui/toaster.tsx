"use client";
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface Toast { id: string; message: string; type: ToastType }
interface ToasterCtx { toast: (message: string, type?: ToastType) => void }

const Ctx = createContext<ToasterCtx>({ toast: () => {} });
export const useToast = () => useContext(Ctx);

let globalToast: ToasterCtx["toast"] = () => {};
export const toast = (message: string, type: ToastType = "info") => globalToast(message, type);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  useEffect(() => { globalToast = addToast; }, [addToast]);

  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const colors = {
    success: "border-green-700/40 bg-green-950/60 text-green-300",
    error: "border-red-700/40 bg-red-950/60 text-red-300",
    info: "border-[var(--accent-30)] bg-[var(--accent-10)] text-[var(--accent)]",
  };

  return (
    <Ctx.Provider value={{ toast: addToast }}>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-3 w-full max-w-sm px-4">
        {toasts.map(t => {
          const Icon = icons[t.type];
          return (
            <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm animate-slide-up ${colors[t.type]}`}>
              <Icon size={16} className="flex-shrink-0" />
              <span className="text-sm font-medium flex-1">{t.message}</span>
              <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} className="opacity-60 hover:opacity-100 transition-opacity">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
