'use client';

import { FiltresRendezVous } from './FiltresRendezVous';
import { RendezVousTable } from './RendezVousTable';
import { CalendrierRendezVous } from './CalendrierRendezVous';
import { useVueRendezVous } from './VueRendezVousToggle';

/**
 * Switch entre vue liste (avec filtres) et vue calendrier mensuel.
 * Le choix est persisté dans l'URL via Nuqs (`?vue=liste|calendrier`).
 */
export function RendezVousAdminContent() {
  const [vue] = useVueRendezVous();

  if (vue === 'calendrier') {
    return <CalendrierRendezVous />;
  }

  return (
    <div className="space-y-4">
      <FiltresRendezVous />
      <RendezVousTable />
    </div>
  );
}
