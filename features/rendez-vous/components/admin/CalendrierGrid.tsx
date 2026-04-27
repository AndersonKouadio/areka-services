import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendrierEvent } from './CalendrierEvent';
import type { RendezVous } from '@prisma/client';

interface Props {
  monthDate: Date;
  rdvs: RendezVous[];
}

const JOURS_SEMAINE = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function CalendrierGrid({ monthDate, rdvs }: Props) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const today = new Date();

  // Index RDV par YYYY-MM-DD
  const rdvsParJour = new Map<string, RendezVous[]>();
  rdvs.forEach((r) => {
    const key = format(r.dateRDV, 'yyyy-MM-dd');
    const existing = rdvsParJour.get(key) ?? [];
    existing.push(r);
    rdvsParJour.set(key, existing);
  });
  // Trier par créneau
  rdvsParJour.forEach((list) =>
    list.sort((a, b) => a.creneau.localeCompare(b.creneau))
  );

  return (
    <div className="bg-card border-border/50 overflow-hidden rounded-xl border">
      <div className="bg-muted/40 border-border/50 grid grid-cols-7 border-b text-xs font-medium uppercase tracking-wide">
        {JOURS_SEMAINE.map((j) => (
          <div
            key={j}
            className="text-foreground/60 px-2 py-2 text-center"
          >
            {j}
          </div>
        ))}
      </div>
      <div className="divide-border/30 grid grid-cols-7 divide-x divide-y">
        {days.map((day) => {
          const inMonth = isSameMonth(day, monthDate);
          const isToday = isSameDay(day, today);
          const list = rdvsParJour.get(format(day, 'yyyy-MM-dd')) ?? [];
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'flex min-h-24 flex-col gap-0.5 p-1.5 sm:min-h-28',
                !inMonth && 'bg-muted/20'
              )}
            >
              <div
                className={cn(
                  'mb-0.5 inline-flex size-6 items-center justify-center self-end rounded-full text-xs',
                  isToday && 'bg-areka-orange font-bold text-white',
                  !isToday && inMonth && 'text-foreground/80',
                  !inMonth && 'text-foreground/30'
                )}
              >
                {format(day, 'd', { locale: fr })}
              </div>
              {list.slice(0, 3).map((rdv) => (
                <CalendrierEvent key={rdv.id} rdv={rdv} />
              ))}
              {list.length > 3 && (
                <p className="text-foreground/50 text-[10px]">
                  +{list.length - 3} autre{list.length - 3 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
