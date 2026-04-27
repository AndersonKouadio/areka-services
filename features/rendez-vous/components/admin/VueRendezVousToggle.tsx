'use client';

import { useQueryState, parseAsStringEnum } from 'nuqs';
import { List, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VueRendezVous = 'liste' | 'calendrier';

/** Hook persisté URL — ?vue=liste | calendrier */
export function useVueRendezVous() {
  return useQueryState(
    'vue',
    parseAsStringEnum<VueRendezVous>(['liste', 'calendrier']).withDefault(
      'liste'
    )
  );
}

export function VueRendezVousToggle() {
  const [vue, setVue] = useVueRendezVous();

  return (
    <div className="bg-muted/40 border-border/50 inline-flex rounded-lg border p-1">
      <ToggleButton
        active={vue === 'liste'}
        onClick={() => setVue('liste')}
        icon={<List size={14} />}
        label="Liste"
      />
      <ToggleButton
        active={vue === 'calendrier'}
        onClick={() => setVue('calendrier')}
        icon={<CalendarDays size={14} />}
        label="Calendrier"
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition',
        active
          ? 'bg-card text-foreground shadow-xs'
          : 'text-foreground/60 hover:text-foreground'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
