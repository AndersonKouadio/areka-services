'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Map, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onMenuOpen: () => void;
}

const PRIMARY_ITEMS = [
  { href: '/admin', label: 'Accueil', icon: LayoutDashboard, exact: true },
  { href: '/admin/rendez-vous', label: 'Rendez-vous', icon: CalendarDays },
  { href: '/admin/tournee', label: 'Tournée', icon: Map },
];

export function BottomNav({ onMenuOpen }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <nav
      aria-label="Navigation principale"
      className="bg-surface/95 border-border/60 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {PRIMARY_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 px-1 py-2.5 text-[11px] font-medium transition',
                active
                  ? 'text-areka-orange'
                  : 'text-foreground/55 hover:text-foreground active:scale-95'
              )}
            >
              {active && (
                <span className="bg-areka-orange absolute inset-x-6 top-0 h-0.5 rounded-full" />
              )}
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Ouvrir le menu"
          className="text-foreground/55 hover:text-foreground active:scale-95 flex flex-col items-center justify-center gap-1 px-1 py-2.5 text-[11px] font-medium transition"
        >
          <Menu size={22} strokeWidth={2} />
          <span className="leading-none">Plus</span>
        </button>
      </div>
    </nav>
  );
}
