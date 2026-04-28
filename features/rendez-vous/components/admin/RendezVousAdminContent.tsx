'use client';

import { FiltresRendezVous } from './FiltresRendezVous';
import { RendezVousTable } from './RendezVousTable';
import { CalendrierRendezVous } from './CalendrierRendezVous';
import { CalendrierSemaine } from './CalendrierSemaine';
import { CalendrierJour } from './CalendrierJour';
import { useVueRendezVous } from './VueRendezVousToggle';
import { AjouterRendezVousModal } from './AjouterRendezVousModal';

/**
 * Switch entre les 4 vues : liste / jour / semaine / mois.
 * Le choix est persisté dans l'URL via Nuqs (`?vue=liste|jour|semaine|mois`).
 */
export function RendezVousAdminContent() {
  const [vue] = useVueRendezVous();

  if (vue === 'mois') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <AjouterRendezVousModal />
        </div>
        <CalendrierRendezVous />
      </div>
    );
  }

  if (vue === 'semaine') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <AjouterRendezVousModal />
        </div>
        <CalendrierSemaine />
      </div>
    );
  }

  if (vue === 'jour') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <AjouterRendezVousModal />
        </div>
        <CalendrierJour />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AjouterRendezVousModal />
      </div>
      <FiltresRendezVous />
      <RendezVousTable />
    </div>
  );
}
