'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  format,
  isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarDays,
  Map,
} from 'lucide-react';
import { Button } from '@heroui/react';
import { useRendezVousListQuery } from '../../queries/rendez-vous-list.query';
import { ChipStatut, ChipType } from './ChipStatut';
import { formaterCreneau, comparerCreneaux } from '@/features/planning/utils/planning.utils';

export function CalendrierJour() {
  const [day, setDay] = useState(() => startOfDay(new Date()));

  const { data, isLoading } = useRendezVousListQuery({
    page: 1,
    limit: 50,
    dateDebut: day.toISOString(),
    dateFin: endOfDay(day).toISOString(),
    sortBy: 'dateRDV',
    sortOrder: 'asc',
  });

  const rdvs = (data?.data ?? [])
    .slice()
    .sort((a, b) => comparerCreneaux(a.creneau, b.creneau));

  const dayIso = format(day, 'yyyy-MM-dd');

  return (
    <div className="space-y-4">
      <div className="bg-card border-border/50 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            onPress={() => setDay(subDays(day, 1))}
            aria-label="Jour précédent"
            className="size-9 px-0"
          >
            <ChevronLeft size={18} />
          </Button>
          <h2 className="text-lg font-semibold capitalize">
            {format(day, 'EEEE d MMMM yyyy', { locale: fr })}
            {isToday(day) && (
              <span className="bg-areka-orange/15 text-areka-orange ml-2 rounded-full px-2 py-0.5 align-middle text-xs">
                Aujourd&apos;hui
              </span>
            )}
          </h2>
          <Button
            variant="tertiary"
            onPress={() => setDay(addDays(day, 1))}
            aria-label="Jour suivant"
            className="size-9 px-0"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onPress={() => setDay(startOfDay(new Date()))}
            className="text-xs"
          >
            <CalendarDays size={14} />
            Aujourd&apos;hui
          </Button>
          <Link
            href={`/admin/tournee?date=${dayIso}`}
            className="border-areka-navy bg-areka-navy text-white hover:bg-areka-navy/90 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition"
          >
            <Map size={14} />
            Voir la tournée
          </Link>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="text-foreground/60 flex items-center justify-center gap-2 py-16 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Chargement...
        </div>
      ) : rdvs.length === 0 ? (
        <div className="bg-card border-border/50 rounded-xl border py-16 text-center">
          <p className="text-foreground/70">Aucun rendez-vous ce jour.</p>
        </div>
      ) : (
        <ol className="space-y-2">
          {rdvs.map((r) => (
            <li
              key={r.id}
              className="bg-card border-border/50 hover:border-areka-orange/40 hover:shadow-sm overflow-hidden rounded-xl border transition"
            >
              <Link href={`/admin/rendez-vous/${r.id}`} className="block">
                <div className="flex items-center gap-4 p-4">
                  <div className="bg-areka-navy/10 text-areka-navy flex w-20 shrink-0 flex-col items-center justify-center rounded-lg py-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {r.creneau.split('-')[0]}
                    </span>
                    <span className="text-foreground/50 text-[10px]">
                      {formaterCreneau(r.creneau)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {r.clientPrenom} {r.clientNom}
                      </p>
                      <ChipType type={r.type} />
                      <ChipStatut statut={r.statut} />
                    </div>
                    <p className="text-foreground/70 mt-1 truncate text-xs">
                      {r.clientAdresse}
                    </p>
                    {r.description && (
                      <p className="text-foreground/60 mt-1 line-clamp-1 text-xs italic">
                        {r.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
