'use server';

import { startOfDay, endOfDay } from 'date-fns';
import prisma from '@/lib/prisma';
import { resoudreCreneauxOuverts } from '@/features/planning/actions/creneaux-resolver.action';

/**
 * Renvoie les créneaux encore disponibles pour une date donnée.
 * Action publique (utilisée par le formulaire client).
 *
 * Filtre les créneaux ouverts (config Planning + JourSpecial) par les RDV déjà pris.
 */
export async function obtenirCreneauxDisponibles(
  date: Date
): Promise<{ creneaux: string[]; ouvert: boolean }> {
  const { creneaux: tousLesCreneaux, ouvert } =
    await resoudreCreneauxOuverts(date);

  if (!ouvert || tousLesCreneaux.length === 0) {
    return { creneaux: [], ouvert: false };
  }

  const rdvDuJour = await prisma.rendezVous.findMany({
    where: {
      dateRDV: { gte: startOfDay(date), lt: endOfDay(date) },
      statut: { in: ['CONFIRME', 'EN_ATTENTE', 'PROPOSE_AUTRE_DATE'] },
    },
    select: { creneau: true },
  });

  const creneauxOccupes = new Set(rdvDuJour.map((r) => r.creneau));
  return {
    creneaux: tousLesCreneaux.filter((c) => !creneauxOccupes.has(c)),
    ouvert: true,
  };
}
