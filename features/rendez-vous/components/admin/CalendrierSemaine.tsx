'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  format,
  isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@heroui/react';
import { useRendezVousListQuery } from '../../queries/rendez-vous-list.query';
import { ChipType } from './ChipStatut';
import { comparerCreneaux } from '@/features/planning/utils/planning.utils';
import { cn } from '@/lib/utils';
import type { RendezVous } from '@prisma/client';

export function CalendrierSemaine() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data, isLoading } = useRendezVousListQuery({
    page: 1,
    limit: 200,
    dateDebut: weekStart.toISOString(),
    dateFin: weekEnd.toISOString(),
    sortBy: 'dateRDV',
    sortOrder: 'asc',
  });

  // Index par yyyy-MM-dd
  const rdvsByDay = new Map<string, RendezVous[]>();
  (data?.data ?? []).forEach((r) => {
    const key = format(r.dateRDV, 'yyyy-MM-dd');
    const list = rdvsByDay.get(key) ?? [];
    list.push(r);
    rdvsByDay.set(key, list);
  });
  rdvsByDay.forEach((list) =>
    list.sort((a, b) => comparerCreneaux(a.creneau, b.creneau))
  );

  return (
    <div className="space-y-4">
      <div className="bg-card border-border/50 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            onPress={() => setWeekStart(subWeeks(weekStart, 1))}
            aria-label="Semaine précédente"
            className="size-9 px-0"
          >
            <ChevronLeft size={18} />
          </Button>
          <h2 className="text-lg font-semibold">
            Semaine du {format(weekStart, 'd MMM', { locale: fr })} au{' '}
            {format(weekEnd, 'd MMM yyyy', { locale: fr })}
          </h2>
          <Button
            variant="tertiary"
            onPress={() => setWeekStart(addWeeks(weekStart, 1))}
            aria-label="Semaine suivante"
            className="size-9 px-0"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        <Button
          variant="outline"
          onPress={() =>
            setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
          }
          className="text-xs"
        >
          <CalendarDays size={14} />
          Cette semaine
        </Button>
      </div>

      {isLoading && !data ? (
        <div className="text-foreground/60 flex items-center justify-center gap-2 py-16 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Chargement...
        </div>
      ) : (
        <div className="bg-card border-border/50 overflow-hidden rounded-xl border">
          {/* Mobile : pile verticale par jour */}
          <ul className="divide-border/40 divide-y md:hidden">
            {days.map((day) => {
              const list = rdvsByDay.get(format(day, 'yyyy-MM-dd')) ?? [];
              const todayClass = isToday(day) && 'bg-areka-orange/5';
              return (
                <li key={day.toISOString()} className={cn('p-3', todayClass)}>
                  <p className="text-sm font-semibold capitalize">
                    {format(day, 'EEEE d MMM', { locale: fr })}
                  </p>
                  {list.length === 0 ? (
                    <p className="text-foreground/50 mt-1 text-xs">—</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {list.map((r) => (
                        <RdvCard key={r.id} rdv={r} />
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop : grille 7 colonnes */}
          <div className="hidden grid-cols-7 md:grid">
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  'border-border/40 border-r p-2 last:border-r-0',
                  isToday(day) && 'bg-areka-orange/5'
                )}
              >
                <p className="mb-2 text-xs font-semibold capitalize">
                  {format(day, 'EEE d', { locale: fr })}
                </p>
                <div className="space-y-1">
                  {(rdvsByDay.get(format(day, 'yyyy-MM-dd')) ?? []).map((r) => (
                    <RdvCard key={r.id} rdv={r} compact />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RdvCard({ rdv, compact }: { rdv: RendezVous; compact?: boolean }) {
  const tone =
    rdv.type === 'ENTRETIEN'
      ? 'border-areka-navy/40 bg-areka-navy/5'
      : rdv.type === 'DEPANNAGE'
        ? 'border-areka-orange/40 bg-areka-orange/5'
        : 'border-areka-raspberry/40 bg-areka-raspberry/5';

  return (
    <Link
      href={`/admin/rendez-vous/${rdv.id}`}
      className={cn(
        'block rounded-md border px-2 py-1 text-xs hover:shadow-sm transition',
        tone
      )}
    >
      <p className="font-medium tabular-nums">{rdv.creneau.split('-')[0]}</p>
      <p className="truncate">
        {rdv.clientPrenom} {rdv.clientNom.charAt(0)}.
      </p>
      {!compact && (
        <p className="mt-0.5">
          <ChipType type={rdv.type} />
        </p>
      )}
    </Link>
  );
}
