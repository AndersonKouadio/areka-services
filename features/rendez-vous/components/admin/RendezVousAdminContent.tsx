'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { FiltresRendezVous } from './FiltresRendezVous';
import { RendezVousTable } from './RendezVousTable';
import { CalendrierRendezVous } from './CalendrierRendezVous';
import { CalendrierSemaine } from './CalendrierSemaine';
import { CalendrierJour } from './CalendrierJour';
import { useVueRendezVous } from './VueRendezVousToggle';

/**
 * Switch entre les 4 vues : liste / jour / semaine / mois.
 * Le choix est persisté dans l'URL via Nuqs (`?vue=liste|jour|semaine|mois`).
 */
export function RendezVousAdminContent() {
  const [vue] = useVueRendezVous();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AjouterRendezVousLink />
      </div>
      {vue === 'mois' && <CalendrierRendezVous />}
      {vue === 'semaine' && <CalendrierSemaine />}
      {vue === 'jour' && <CalendrierJour />}
      {vue === 'liste' && (
        <>
          <FiltresRendezVous />
          <RendezVousTable />
        </>
      )}
    </div>
  );
}

function AjouterRendezVousLink() {
  return (
    <Link
      href="/admin/rendez-vous/nouveau"
      className="button button--primary inline-flex"
    >
      <Plus size={16} />
      Ajouter un RDV
    </Link>
  );
}
