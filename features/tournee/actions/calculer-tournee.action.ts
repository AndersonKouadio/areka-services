'use server';

import { headers } from 'next/headers';
import { startOfDay, endOfDay } from 'date-fns';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import {
  geocoderAdresse,
  calculerOrdreNearestNeighbour,
} from '@/lib/geo/openroute';
import type { TourneeJour, RendezVousAvecOrdre } from '../types/tournee.type';

/**
 * Adresse de départ Areka (Lieu-dit l'Hermitage, 49300 Cholet).
 * Coordonnées approximatives pré-calculées pour éviter un geocoding inutile.
 */
const DEPART_AREKA = { lat: 47.0617, lng: -0.8786 };

export async function calculerTourneeJour(date: Date): Promise<TourneeJour> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Non autorisé');

  const rdvs = await prisma.rendezVous.findMany({
    where: {
      dateRDV: { gte: startOfDay(date), lt: endOfDay(date) },
      // Inclure tous les RDV actifs (confirmés + en attente + propositions ouvertes)
      statut: { in: ['CONFIRME', 'EN_ATTENTE', 'PROPOSE_AUTRE_DATE'] },
    },
    orderBy: { creneau: 'asc' },
  });

  // Géocodage en parallèle (limite à éviter rate-limit ORS — OK pour < 10 RDV/jour)
  const geocoded = await Promise.all(
    rdvs.map(async (r) => ({
      rdv: r,
      coords: await geocoderAdresse(r.clientAdresse),
    }))
  );

  const avecCoords = geocoded.filter((g) => g.coords !== null) as {
    rdv: (typeof geocoded)[number]['rdv'];
    coords: NonNullable<(typeof geocoded)[number]['coords']>;
  }[];
  const sansCoords = geocoded.filter((g) => !g.coords).map((g) => g.rdv);

  const ordres = calculerOrdreNearestNeighbour(
    DEPART_AREKA,
    avecCoords.map((g) => ({ id: g.rdv.id, coords: g.coords }))
  );

  const ordreMap = new Map(ordres.map((o) => [o.id, o]));
  const rdvsOrdonnes: RendezVousAvecOrdre[] = avecCoords
    .map((g) => {
      const o = ordreMap.get(g.rdv.id);
      return {
        rdv: g.rdv,
        coords: g.coords,
        ordre: o?.ordre ?? 0,
        distanceDepuisPrecedent: o?.distanceKm ?? 0,
      };
    })
    .sort((a, b) => a.ordre - b.ordre);

  const distanceTotale = rdvsOrdonnes.reduce(
    (sum, r) => sum + r.distanceDepuisPrecedent,
    0
  );

  return {
    date: date.toISOString(),
    depart: DEPART_AREKA,
    rdvs: rdvsOrdonnes,
    distanceTotale,
    rdvsSansCoords: sansCoords,
  };
}
