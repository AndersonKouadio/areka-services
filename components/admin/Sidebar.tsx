'use client';

import Link, { useLinkStatus } from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Map,
  QrCode,
  Settings,
  LogOut,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/rendez-vous', label: 'Rendez-vous', icon: CalendarDays },
  { href: '/admin/tournee', label: 'Tournée', icon: Map },
  { href: '/admin/qrcode', label: 'QR Code', icon: QrCode },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

interface SidebarProps {
  user: { name: string | null; email: string };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/auth/sign-in');
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="bg-sidebar border-sidebar-border text-sidebar-foreground sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r md:flex">
      <div className="border-sidebar-border border-b px-6 py-5">
        <Link href="/admin" className="block">
          <Image src="/logo.png" alt="Areka Services" width={120} height={80} />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <SidebarItemContent Icon={item.icon} label={item.label} />
            </Link>
          );
        })}
      </nav>

      <div className="border-sidebar-border space-y-2 border-t p-4">
        <div className="px-2">
          <p className="text-sm font-medium leading-tight">
            {user.name ?? 'Admin'}
          </p>
          <p className="text-sidebar-foreground/60 truncate text-xs">
            {user.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

function SidebarItemContent({ Icon, label }: { Icon: LucideIcon; label: string }) {
  const { pending } = useLinkStatus();
  return (
    <>
      {pending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Icon size={18} />
      )}
      {label}
    </>
  );
}
