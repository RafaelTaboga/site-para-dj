import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublicDjSite } from "@/components/public/PublicDjSite";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dj = await prisma.user.findUnique({
    where: { slug: params.slug },
    include: { profile: true },
  });
  if (!dj?.profile) return { title: "DJ não encontrado" };
  return {
    title: `${dj.profile.artistName} — DJ Profissional`,
    description: dj.profile.tagline ?? dj.profile.bio?.slice(0, 160) ?? `Site oficial do ${dj.profile.artistName}`,
  };
}

export default async function DjPublicPage({ params }: Props) {
  const dj = await prisma.user.findUnique({
    where: { slug: params.slug },
    include: {
      profile: true,
      socialLinks: { orderBy: { order: "asc" } },
      mediaItems: { where: { isVisible: true }, orderBy: { order: "asc" }, take: 12 },
    },
  });

  if (!dj || !dj.profile?.isPublished) notFound();

  return <PublicDjSite dj={dj as any} />;
}

export const revalidate = 60; // ISR: revalidate every 60s
