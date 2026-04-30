'use server';

import { startOfDay, endOfDay } from 'date-fns';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-session';
import {
  geocoderAdresse,
  calculerOrdreNearestNeighbour,
  type Coordinates,
} from '@/lib/geo/openroute';
import type { TourneeJour, RendezVousAvecOrdre } from '../types/tournee.type';
import type { RendezVous } from '@prisma/client';

/**
 * Adresse de départ Areka (Lieu-dit l'Hermitage, 49300 Cholet).
 * Coordonnées approximatives pré-calculées pour éviter un geocoding inutile.
 */
const DEPART_AREKA = { lat: 47.0617, lng: -0.8786 };

/**
 * Convertit "8h30-9h30" en minutes depuis minuit pour le tri.
 */
function creneauStartMin(creneau: string): number {
  const m = creneau.match(/^(\d{1,2})h(\d{2})/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

export async function calculerTourneeJour(date: Date): Promise<TourneeJour> {
  const session = await getSession();
  if (!session) throw new Error('Non autorisé');

  const rdvs = await prisma.rendezVous.findMany({
    where: {
      dateRDV: { gte: startOfDay(date), lt: endOfDay(date) },
      // Inclure tous les RDV actifs (confirmés + en attente + propositions ouvertes)
      statut: { in: ['CONFIRME', 'EN_ATTENTE', 'PROPOSE_AUTRE_DATE'] },
    },
    orderBy: { creneau: 'asc' },
  });

  // Priorité aux coords stockées en DB (capturées via l'autocomplete à la création).
  // Fallback sur le geocoding lazy pour les RDV legacy sans coords.
  const geocoded = await Promise.all(
    rdvs.map(async (r) => {
      if (r.latitude != null && r.longitude != null) {
        return { rdv: r, coords: { lat: r.latitude, lng: r.longitude } };
      }
      return { rdv: r, coords: await geocoderAdresse(r.clientAdresse) };
    })
  );

  const avecCoords = geocoded.filter((g) => g.coords !== null) as {
    rdv: RendezVous;
    coords: Coordinates;
  }[];
  const sansCoords = geocoded.filter((g) => !g.coords).map((g) => g.rdv);

  /* RESPECT DES CRÉNEAUX HORAIRES :
     L'ordre chronologique du créneau est PRIORITAIRE sur la distance.
     Un RDV à 8h30 doit toujours précéder un RDV à 14h00, peu importe la distance.
     On sépare matin / après-midi, on trie par heure dans chaque demi-journée,
     puis nearest-neighbour est appliqué SEULEMENT entre RDV de même heure
     (cas rare — sinon l'ordre chronologique gagne). */
  const matin = avecCoords.filter((g) => creneauStartMin(g.rdv.creneau) < 12 * 60);
  const aprem = avecCoords.filter((g) => creneauStartMin(g.rdv.creneau) >= 12 * 60);

  const trier = (
    groupe: typeof avecCoords,
    pointDepart: Coordinates
  ): RendezVousAvecOrdre[] => {
    if (groupe.length === 0) return [];
    // Tri par créneau (chronologique strict)
    const sorted = [...groupe].sort(
      (a, b) => creneauStartMin(a.rdv.creneau) - creneauStartMin(b.rdv.creneau)
    );
    // Distances séquentielles depuis le point de départ
    const result: RendezVousAvecOrdre[] = [];
    let courant = pointDepart;
    sorted.forEach((g, idx) => {
      const ordres = calculerOrdreNearestNeighbour(courant, [
        { id: g.rdv.id, coords: g.coords },
      ]);
      const dist = ordres[0]?.distanceKm ?? 0;
      result.push({
        rdv: g.rdv,
        coords: g.coords,
        ordre: idx,
        distanceDepuisPrecedent: dist,
      });
      courant = g.coords;
    });
    return result;
  };

  const matinOrdonne = trier(matin, DEPART_AREKA);
  const dernierMatin =
    matinOrdonne[matinOrdonne.length - 1]?.coords ?? DEPART_AREKA;
  const apremOrdonne = trier(aprem, dernierMatin);

  // Re-numérotation globale (matin: 0..N, après-midi: N..M)
  const rdvsOrdonnes: RendezVousAvecOrdre[] = [
    ...matinOrdonne,
    ...apremOrdonne.map((r, i) => ({
      ...r,
      ordre: matinOrdonne.length + i,
    })),
  ];

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
