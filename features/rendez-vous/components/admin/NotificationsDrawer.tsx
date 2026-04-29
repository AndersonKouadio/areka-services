'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { X, Inbox, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationsPendantesQuery } from '../../queries/notifications-pendantes.query';
import { ChipType } from './ChipStatut';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { RendezVous } from '@prisma/client';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsDrawer({ open, onClose }: NotificationsDrawerProps) {
  const { data, isLoading, isError } = useNotificationsPendantesQuery();
  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;

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
        aria-label="Notifications"
        className={cn(
          'bg-surface fixed inset-y-0 right-0 z-50 flex w-[90%] max-w-sm flex-col shadow-2xl transition-transform duration-300 md:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <header className="border-border/60 flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <Inbox size={18} className="text-areka-orange" />
            <h2 className="font-semibold">Demandes en attente</h2>
            {total > 0 && (
              <span className="bg-areka-amber/15 text-areka-amber rounded-full px-2 py-0.5 text-xs font-medium">
                {total}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="hover:bg-muted/60 inline-flex size-9 items-center justify-center rounded-full transition"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {isLoading && <DrawerStateLoading />}
          {!isLoading && isError && <DrawerStateError />}
          {!isLoading && !isError && items.length === 0 && <DrawerStateEmpty />}
          {!isLoading && !isError && items.length > 0 && (
            <ul className="divide-border/40 divide-y">
              {items.map((rdv) => (
                <NotificationItem key={rdv.id} rdv={rdv} onClick={onClose} />
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

function NotificationItem({ rdv, onClick }: { rdv: RendezVous; onClick: () => void }) {
  return (
    <li>
      <Link
        href={`/admin/rendez-vous/${rdv.id}`}
        onClick={onClick}
        className="hover:bg-muted/50 flex flex-col gap-2 px-5 py-4 transition"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium leading-tight">
              {rdv.clientPrenom} {rdv.clientNom}
            </p>
            <p className="text-foreground/60 mt-1 truncate text-xs">
              {rdv.reference}
            </p>
          </div>
          <ChipType type={rdv.type} />
        </div>
        <p className="text-foreground/70 text-xs">
          {new Date(rdv.dateRDV).toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}{' '}
          · {formaterCreneau(rdv.creneau)} · reçu {tempsRelatif(rdv.createdAt)}
        </p>
      </Link>
    </li>
  );
}

function DrawerStateLoading() {
  return (
    <div className="text-foreground/50 flex flex-col items-center justify-center gap-2 px-5 py-16 text-sm">
      <div className="border-areka-orange/30 border-t-areka-orange size-6 animate-spin rounded-full border-2" />
      Chargement...
    </div>
  );
}

function DrawerStateError() {
  return (
    <div className="text-areka-coral flex flex-col items-center justify-center gap-2 px-5 py-16 text-center text-sm">
      <BellOff size={32} />
      <p className="font-medium">Impossible de charger les notifications</p>
      <p className="text-foreground/50 text-xs">Réessayez dans un instant.</p>
    </div>
  );
}

function DrawerStateEmpty() {
  return (
    <div className="text-foreground/50 flex flex-col items-center justify-center gap-3 px-5 py-16 text-center text-sm">
      <div className="bg-areka-green/10 text-areka-green flex size-14 items-center justify-center rounded-full">
        <Inbox size={24} />
      </div>
      <p className="text-foreground font-medium">Tout est à jour</p>
      <p className="text-xs">Aucune demande en attente.</p>
    </div>
  );
}

function tempsRelatif(date: Date | string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `il y a ${heures}h`;
  const jours = Math.floor(heures / 24);
  if (jours < 7) return `il y a ${jours}j`;
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
