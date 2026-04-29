'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationsPendantesQuery } from '@/features/rendez-vous/queries/notifications-pendantes.query';
import { NotificationsDrawer } from '@/features/rendez-vous/components/admin/NotificationsDrawer';

interface MobileTopBarProps {
  title?: string;
}

export function MobileTopBar({ title }: MobileTopBarProps) {
  const [open, setOpen] = useState(false);
  const { data } = useNotificationsPendantesQuery();
  const count = data?.meta.total ?? 0;

  return (
    <>
      <header
        className="bg-surface/95 border-border/60 sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur-md md:hidden"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <Link href="/admin" aria-label="Tableau de bord" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Areka" width={120} height={80} className="h-9 w-auto" />
        </Link>
        {title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold">{title}</h1>
        )}
        <button
          type="button"
          aria-label={count > 0 ? `Notifications (${count} en attente)` : 'Notifications'}
          onClick={() => setOpen(true)}
          className="hover:bg-muted/60 relative inline-flex size-10 items-center justify-center rounded-full transition"
        >
          <Bell size={18} />
          {count > 0 && (
            <span
              aria-hidden
              className="bg-areka-coral text-background absolute -right-0.5 -top-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-[18px] ring-2 ring-surface"
            >
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>
      </header>
      <NotificationsDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
