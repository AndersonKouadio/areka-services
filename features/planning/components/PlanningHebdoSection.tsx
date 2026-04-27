'use client';

import { Loader2 } from 'lucide-react';
import { JourCard } from './JourCard';
import { usePlanningHebdoQuery } from '../queries/planning-list.query';

interface Props {
  initialData: Awaited<ReturnType<typeof import('../actions/planning.actions').obtenirPlanningHebdo>>;
}

export function PlanningHebdoSection({ initialData }: Props) {
  const { data, isLoading } = usePlanningHebdoQuery();
  const list = data ?? initialData;

  if (isLoading && !list.length) {
    return (
      <div className="text-foreground/60 flex items-center gap-2 py-8 text-sm">
        <Loader2 size={16} className="animate-spin" /> Chargement…
      </div>
    );
  }

  // Trier dimanche (0) en dernier pour avoir Lun → Dim
  const sorted = [...list].sort((a, b) => {
    const aOrder = a.jourSemaine === 0 ? 7 : a.jourSemaine;
    const bOrder = b.jourSemaine === 0 ? 7 : b.jourSemaine;
    return aOrder - bOrder;
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sorted.map((p) => (
        <JourCard key={p.id} planning={p} />
      ))}
    </div>
  );
}
