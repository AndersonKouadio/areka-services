'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Map,
  QrCode,
  Settings,
  LogOut,
  X,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  user: { name: string | null; email: string };
}

const ALL_ITEMS = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/rendez-vous', label: 'Rendez-vous', icon: CalendarDays },
  { href: '/admin/tournee', label: 'Tournée', icon: Map },
  { href: '/admin/qrcode', label: 'QR Code', icon: QrCode },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

export function MobileDrawer({ open, onClose, user }: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const handleSignOut = async () => {
    onClose();
    await authClient.signOut();
    router.push('/auth/sign-in');
    router.refresh();
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          'bg-surface fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col shadow-2xl transition-transform duration-300 md:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <header className="border-border/60 flex items-center justify-between border-b px-5 py-4">
          <Link href="/admin" onClick={onClose} className="block">
            <Image src="/logo.png" alt="Areka Services" width={120} height={80} className="h-10 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="hover:bg-muted/60 inline-flex size-10 items-center justify-center rounded-full transition"
          >
            <X size={20} />
          </button>
        </header>

        <div className="border-border/60 flex items-center gap-3 border-b px-5 py-4">
          <div className="bg-areka-orange/15 text-areka-orange flex size-10 items-center justify-center rounded-full">
            <UserIcon size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium leading-tight">{user.name ?? 'Admin'}</p>
            <p className="text-foreground/60 truncate text-xs">{user.email}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {ALL_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                      active
                        ? 'bg-areka-orange/10 text-areka-orange'
                        : 'text-foreground/70 hover:bg-muted/60 hover:text-foreground'
                    )}
                  >
                    <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-border/60 border-t p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="text-foreground/70 hover:bg-areka-coral/10 hover:text-areka-coral flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
