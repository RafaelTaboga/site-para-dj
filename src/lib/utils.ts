import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "@/lib/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function generateUniqueSlug(artistName: string): Promise<string> {
  const base = slugify(artistName);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.user.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  WEDDING: "💍 Casamento",
  CORPORATE: "🏢 Corporativo",
  BIRTHDAY: "🎂 Aniversário",
  UNIVERSITY: "🎓 Formatura",
  NIGHTCLUB: "🎉 Balada",
  FESTIVAL: "🎪 Festival",
  OTHER: "📋 Outro",
};

export const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/seuperfil" },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@seuperfil" },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@seuperfil" },
  { id: "spotify", label: "Spotify", placeholder: "https://open.spotify.com/artist/..." },
  { id: "soundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/seuperfil" },
];
