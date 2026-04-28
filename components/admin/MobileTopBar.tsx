'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell } from 'lucide-react';

interface MobileTopBarProps {
  title?: string;
}

export function MobileTopBar({ title }: MobileTopBarProps) {
  return (
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
        aria-label="Notifications"
        className="hover:bg-muted/60 relative inline-flex size-10 items-center justify-center rounded-full transition"
      >
        <Bell size={18} />
      </button>
    </header>
  );
}
