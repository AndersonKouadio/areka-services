import type { Planning, JourSpecial } from '@prisma/client';

export type { Planning, JourSpecial };

/** 0 = dimanche, 6 = samedi (cf. Date.getDay()) */
export type JourSemaine = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const LIBELLES_JOURS: Record<number, string> = {
  0: 'Dimanche',
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
};

export interface IJourSpecialParams {
  dateDebut?: string;
  dateFin?: string;
  actif?: boolean;
}
