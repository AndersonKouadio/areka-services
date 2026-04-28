'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';
import { MobileTopBar } from './MobileTopBar';
import { PwaRegistrar } from './PwaRegistrar';

interface AdminShellProps {
  user: { name: string | null; email: string };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      <PwaRegistrar />

      <Sidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <div className="flex-1 overflow-x-hidden pb-20 md:pb-0">{children}</div>
        <BottomNav onMenuOpen={() => setDrawerOpen(true)} />
      </div>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
      />
    </div>
  );
}
