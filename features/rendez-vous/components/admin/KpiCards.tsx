import { Clock, CalendarCheck, CalendarRange, ListChecks } from 'lucide-react';
import type { StatsRendezVous } from '../../actions/stats.action';

interface KpiCardsProps {
  stats: StatsRendezVous;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const items = [
    {
      label: 'En attente',
      value: stats.enAttente,
      icon: Clock,
      tone: 'amber' as const,
      hint: 'Demandes à valider',
    },
    {
      label: "Aujourd'hui",
      value: stats.confirmesAujourdhui,
      icon: CalendarCheck,
      tone: 'green' as const,
      hint: 'RDV confirmés',
    },
    {
      label: 'Cette semaine',
      value: stats.semaineCourante,
      icon: CalendarRange,
      tone: 'orange' as const,
      hint: 'Confirmés + en attente',
    },
    {
      label: 'Total',
      value: stats.total,
      icon: ListChecks,
      tone: 'navy' as const,
      hint: 'Toutes les demandes',
    },
  ];

  const tones = {
    amber: 'bg-areka-amber/15 text-areka-amber',
    green: 'bg-areka-green/15 text-areka-green',
    orange: 'bg-areka-orange/15 text-areka-orange',
    navy: 'bg-areka-navy/15 text-areka-navy',
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.label}
            className="bg-card border-border/50 rounded-xl border p-5 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-xs font-medium uppercase tracking-wider">
                  {it.label}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {it.value}
                </p>
                <p className="text-foreground/50 mt-1 text-xs">{it.hint}</p>
              </div>
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${tones[it.tone]}`}
              >
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
