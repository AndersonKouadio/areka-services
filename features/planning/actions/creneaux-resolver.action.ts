import 'server-only';

import { startOfDay } from 'date-fns';
import prisma from '@/lib/prisma';
import { comparerCreneaux } from '../utils/planning.utils';

/**
 * Résout les créneaux théoriquement ouverts pour une date donnée.
 * Logique :
 *   1. Si JourSpecial existe pour cette date → utilise ses valeurs (override).
 *   2. Sinon → utilise Planning[jourSemaine] (config hebdo).
 *   3. Si actif=false ou aucune config → []
 *
 * NOTE : ne tient PAS compte des RDV déjà pris.
 *        Pour la disponibilité réelle, voir obtenirCreneauxDisponibles côté rendez-vous.
 */
export async function resoudreCreneauxOuverts(
  date: Date
): Promise<{ creneaux: string[]; ouvert: boolean }> {
  const jour = startOfDay(date);

  // 1. Override JourSpecial ?
  const jourSpecial = await prisma.jourSpecial.findUnique({
    where: { date: jour },
  });
  if (jourSpecial) {
    if (!jourSpecial.actif) return { creneaux: [], ouvert: false };
    return {
      creneaux: [...jourSpecial.creneaux].sort(comparerCreneaux),
      ouvert: true,
    };
  }

  // 2. Config hebdo
  const config = await prisma.planning.findUnique({
    where: { jourSemaine: date.getDay() },
  });
  if (!config || !config.actif) return { creneaux: [], ouvert: false };
  return {
    creneaux: [...config.creneaux].sort(comparerCreneaux),
    ouvert: true,
  };
}

/** Vérifie qu'un créneau est dans la config ouverte du jour. */
export async function estCreneauOuvert(
  date: Date,
  creneau: string
): Promise<boolean> {
  const { creneaux, ouvert } = await resoudreCreneauxOuverts(date);
  return ouvert && creneaux.includes(creneau);
}
