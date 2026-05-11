import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileEditor } from "@/components/dashboard/ProfileEditor";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [profile, socialLinks] = await Promise.all([
    prisma.djProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.socialLink.findMany({ where: { userId: session.user.id }, orderBy: { order: "asc" } }),
  ]);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Editar Meu Site</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Seu site público: <a href={`/${user?.slug}`} target="_blank" className="text-[var(--accent)] hover:underline">/{user?.slug}</a>
        </p>
      </div>
      <ProfileEditor profile={profile as any} socialLinks={socialLinks} slug={user?.slug ?? ""} />
    </div>
  );
}
