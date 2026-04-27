import type { RendezVous } from '@prisma/client';
import type { Coordinates } from '@/lib/geo/openroute';

export interface RendezVousAvecOrdre {
  rdv: RendezVous;
  ordre: number;
  distanceDepuisPrecedent: number; // km
  coords: Coordinates | null;
}

export interface TourneeJour {
  date: string; // ISO
  depart: Coordinates;
  rdvs: RendezVousAvecOrdre[];
  distanceTotale: number; // km
  rdvsSansCoords: RendezVous[]; // RDV qu'on n'a pas pu géocoder
}
