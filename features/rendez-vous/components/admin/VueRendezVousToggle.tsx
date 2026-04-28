'use client';

import { useQueryState, parseAsStringEnum } from 'nuqs';
import { List, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VueRendezVous = 'liste' | 'mois' | 'semaine' | 'jour';

const VUES: { id: VueRendezVous; label: string; Icon: typeof List }[] = [
  { id: 'liste', label: 'Liste', Icon: List },
  { id: 'jour', label: 'Jour', Icon: CalendarDays },
  { id: 'semaine', label: 'Semaine', Icon: CalendarRange },
  { id: 'mois', label: 'Mois', Icon: Calendar },
];

/** Hook persisté URL — ?vue=liste|jour|semaine|mois */
export function useVueRendezVous() {
  return useQueryState(
    'vue',
    parseAsStringEnum<VueRendezVous>([
      'liste',
      'jour',
      'semaine',
      'mois',
    ]).withDefault('liste')
  );
}

export function VueRendezVousToggle() {
  const [vue, setVue] = useVueRendezVous();

  return (
    <div
      role="radiogroup"
      aria-label="Choix de vue"
      className="bg-muted/40 border-border/50 inline-flex rounded-lg border p-1"
    >
      {VUES.map(({ id, label, Icon }) => {
        const active = vue === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setVue(id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition',
              active
                ? 'bg-card text-foreground shadow-xs'
                : 'text-foreground/70 hover:text-foreground'
            )}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
