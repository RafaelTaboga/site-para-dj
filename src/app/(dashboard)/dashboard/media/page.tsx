import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MediaManager } from "@/components/dashboard/MediaManager";

export default async function MediaPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const mediaItems = await prisma.mediaItem.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Galeria de Fotos</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Adicione fotos e vídeos que aparecem no seu site público.
        </p>
      </div>
      <MediaManager initialItems={mediaItems as any} />
    </div>
  );
}
