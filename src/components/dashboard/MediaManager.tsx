"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Eye, EyeOff, Loader2, ImageIcon, Plus, GripVertical } from "lucide-react";
import { toast } from "@/components/ui/toaster";

type MediaItem = {
  id: string; url: string; caption?: string;
  isVisible: boolean; type: string; order: number;
};

export function MediaManager({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [addingVideo, setAddingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (data.url) {
          const saveRes = await fetch("/api/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: data.url, type: "PHOTO", order: items.length }),
          });
          const newItem = await saveRes.json();
          setItems(prev => [...prev, newItem]);
        }
      }
      toast("Fotos enviadas com sucesso!", "success");
    } catch {
      toast("Erro ao enviar fotos", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function addVideoUrl() {
    if (!videoUrl.trim()) return;
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl, type: "VIDEO_URL", order: items.length }),
    });
    const newItem = await res.json();
    setItems(prev => [...prev, newItem]);
    setVideoUrl("");
    setAddingVideo(false);
    toast("Vídeo adicionado!", "success");
  }

  async function toggleVisibility(id: string) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    await fetch(`/api/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !item.isVisible }),
    });
    setItems(prev => prev.map(i => i.id === id ? { ...i, isVisible: !i.isVisible } : i));
  }

  async function deleteItem(id: string) {
    if (!confirm("Remover esta mídia do seu site?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== id));
    toast("Mídia removida", "info");
  }

  async function updateCaption(id: string, caption: string) {
    await fetch(`/api/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption }),
    });
    setItems(prev => prev.map(i => i.id === id ? { ...i, caption } : i));
  }

  return (
    <div className="space-y-5">
      {/* Upload area */}
      <div className="bg-[var(--card)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent-30)] rounded-2xl p-8 text-center transition-all">
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-10)] border border-[var(--accent-30)] flex items-center justify-center">
              <Upload size={24} className="text-[var(--accent)]" />
            </div>
          )}
          <div>
            <p className="font-semibold">{uploading ? "Enviando..." : "Enviar Fotos"}</p>
            <p className="text-[var(--muted-foreground)] text-sm mt-1">Arraste ou clique para selecionar. JPG, PNG, WEBP até 10MB.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent)] text-black text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-all">
              <Plus size={15} /> Adicionar Fotos
            </button>
            <button onClick={() => setAddingVideo(!addingVideo)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--muted-foreground)] hover:border-[var(--accent-30)] hover:text-white transition-all">
              + Link de Vídeo
            </button>
          </div>
        </div>

        {addingVideo && (
          <div className="mt-5 flex gap-3 max-w-lg mx-auto">
            <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all" />
            <button onClick={addVideoUrl} className="px-4 py-2 bg-[var(--accent)] text-black rounded-xl text-sm font-bold">Adicionar</button>
            <button onClick={() => setAddingVideo(false)} className="px-3 py-2 border border-[var(--border)] rounded-xl text-sm text-[var(--muted-foreground)]">✕</button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-[var(--muted-foreground)]">
        <span>{items.length} item{items.length !== 1 ? "s" : ""} no total</span>
        <span>·</span>
        <span>{items.filter(i => i.isVisible).length} visíveis no site</span>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="py-20 text-center text-[var(--muted-foreground)]">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
          <p>Nenhuma mídia ainda. Adicione fotos para seu site!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className={`group relative rounded-xl overflow-hidden border transition-all ${item.isVisible ? "border-[var(--border)]" : "border-[var(--border)] opacity-50"}`}>
              {/* Thumbnail */}
              <div className="aspect-square bg-[var(--muted)] relative">
                {item.type === "PHOTO" ? (
                  <Image src={item.url} alt={item.caption ?? ""} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-[var(--muted)]">🎬</div>
                )}
                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => toggleVisibility(item.id)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                    title={item.isVisible ? "Ocultar" : "Mostrar"}>
                    {item.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => deleteItem(item.id)}
                    className="w-9 h-9 rounded-full bg-red-900/60 hover:bg-red-800 flex items-center justify-center transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {/* Caption */}
              <div className="p-2 bg-[var(--card)]">
                <input
                  defaultValue={item.caption ?? ""}
                  onBlur={e => updateCaption(item.id, e.target.value)}
                  placeholder="Legenda..."
                  className="w-full bg-transparent text-xs text-[var(--muted-foreground)] outline-none placeholder:text-[var(--border-hover)] focus:text-white transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
