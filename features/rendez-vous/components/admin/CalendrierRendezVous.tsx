'use client';

import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  format,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2, CalendarDays } from 'lucide-react';
import { Button } from '@heroui/react';
import { useRendezVousListQuery } from '../../queries/rendez-vous-list.query';
import { CalendrierGrid } from './CalendrierGrid';

export function CalendrierRendezVous() {
  const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()));
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  const { data, isLoading } = useRendezVousListQuery({
    page: 1,
    limit: 200, // assez large pour un mois (rare > 200 RDV)
    dateDebut: monthStart.toISOString(),
    dateFin: monthEnd.toISOString(),
    sortBy: 'dateRDV',
    sortOrder: 'asc',
  });

  return (
    <div className="space-y-4">
      <div className="bg-card border-border/50 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            onPress={() => setMonthDate(subMonths(monthDate, 1))}
            aria-label="Mois précédent"
            className="size-9 px-0"
          >
            <ChevronLeft size={18} />
          </Button>
          <h2 className="text-lg font-semibold capitalize">
            {format(monthDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <Button
            variant="tertiary"
            onPress={() => setMonthDate(addMonths(monthDate, 1))}
            aria-label="Mois suivant"
            className="size-9 px-0"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        <Button
          variant="outline"
          onPress={() => setMonthDate(startOfMonth(new Date()))}
          className="text-xs"
        >
          <CalendarDays size={14} />
          Aujourd&apos;hui
        </Button>
      </div>

      {isLoading && !data ? (
        <div className="text-foreground/60 flex items-center justify-center gap-2 py-16 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Chargement...
        </div>
      ) : (
        <CalendrierGrid monthDate={monthDate} rdvs={data?.data ?? []} />
      )}

      <CalendrierLegende />
    </div>
  );
}

function CalendrierLegende() {
  return (
    <div className="text-foreground/60 flex flex-wrap items-center gap-4 px-2 text-xs">
      <span className="font-medium">Légende :</span>
      <LegendeItem color="bg-areka-navy" label="Entretien" />
      <LegendeItem color="bg-areka-orange" label="Dépannage" />
      <LegendeItem color="bg-areka-raspberry" label="Panne urgente" />
      <span className="border-foreground/30 ml-2 inline-flex h-3 w-4 rounded border border-dashed" />
      <span>En attente</span>
    </div>
  );
}

function LegendeItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block size-3 rounded-sm ${color}`} />
      {label}
    </span>
  );
}
