"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Inbox, Palette, Bot, CreditCard, Image,
  ExternalLink, LogOut, Music2, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: { name: string; email: string; slug: string };
  profile: any;
  subscription: any;
  trialDays: number;
}

const NAV = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/dashboard/proposals", label: "Propostas", icon: Inbox, badgeKey: "new" },
  { href: "/dashboard/profile", label: "Meu Site", icon: Palette },
  { href: "/dashboard/media", label: "Galeria", icon: Image },
  { href: "/dashboard/ai-config", label: "Config IA", icon: Bot },
  { href: "/dashboard/billing", label: "Assinatura", icon: CreditCard },
];

export function DashboardSidebar({ user, profile, subscription, trialDays }: SidebarProps) {
  const pathname = usePathname();
  const isTrialing = subscription?.status === "TRIALING";

  return (
    <aside className="w-64 flex-shrink-0 bg-[var(--card)] border-r border-[var(--border)] flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-10)] border border-[var(--accent-30)] flex items-center justify-center">
            <Music2 size={18} className="text-[var(--accent)]" />
          </div>
          <div>
            <div className="font-display font-bold text-sm leading-tight">{profile?.artistName ?? user.name}</div>
            <div className="text-[var(--muted-foreground)] text-xs">{user.email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(item => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-[var(--accent-10)] text-[var(--accent)] border border-[var(--accent-30)]"
                  : "text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--muted)]"
              )}>
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 space-y-3 border-t border-[var(--border)]">
        {isTrialing && (
          <div className="bg-[var(--muted)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={13} className="text-[var(--accent)]" />
              <span className="text-xs font-semibold text-[var(--accent)]">TRIAL</span>
            </div>
            <p className="text-sm font-bold">{trialDays} dias restantes</p>
            <div className="mt-2 bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all"
                style={{ width: `${((7 - trialDays) / 7) * 100}%` }}
              />
            </div>
            <Link href="/dashboard/billing" className="block mt-2 text-xs text-[var(--accent)] hover:underline">
              Assinar plano →
            </Link>
          </div>
        )}

        {profile?.isPublished && (
          <a
            href={`/${user.slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--muted)] transition-all"
          >
            <ExternalLink size={15} />
            Ver meu site
          </a>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-red-950/20 transition-all"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </aside>
  );
}
