import { z } from 'zod';
import {
  validerCreneau,
  detecterChevauchement,
} from '../utils/planning.utils';

const CRENEAU_REGEX = /^\d{1,2}h\d{2}-\d{1,2}h\d{2}$/;

/**
 * Validateur Zod pour un tableau de créneaux :
 * - chaque item au format `Xh00-Xh00`
 * - chaque item avec `start < end` et heures plausibles
 * - aucun chevauchement entre créneaux
 */
const creneauxArray = z
  .array(z.string().trim().regex(CRENEAU_REGEX, 'Format créneau invalide'))
  .superRefine((arr, ctx) => {
    arr.forEach((c, i) => {
      const err = validerCreneau(c);
      if (err) {
        ctx.addIssue({ code: 'custom', message: err, path: [i] });
      }
    });
    const overlap = detecterChevauchement(arr);
    if (overlap) {
      ctx.addIssue({ code: 'custom', message: overlap });
    }
  });

/** Schéma config hebdomadaire (un Planning par jour de semaine). */
export const updatePlanningSchema = z.object({
  jourSemaine: z.number().int().min(0).max(6),
  actif: z.boolean(),
  creneaux: creneauxArray,
});
export type UpdatePlanningDTO = z.infer<typeof updatePlanningSchema>;

/** Schéma override ponctuel (vacances, jour férié, permanence). */
export const createJourSpecialSchema = z.object({
  date: z.coerce.date(),
  actif: z.boolean().default(false),
  creneaux: creneauxArray.default([]),
  motif: z.string().trim().max(200).optional(),
});
export type CreateJourSpecialDTO = z.infer<typeof createJourSpecialSchema>;

export const updateJourSpecialSchema = createJourSpecialSchema.partial();
export type UpdateJourSpecialDTO = z.infer<typeof updateJourSpecialSchema>;
