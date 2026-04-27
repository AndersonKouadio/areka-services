import { z } from 'zod';

const CRENEAU_REGEX = /^\d{1,2}h\d{2}-\d{1,2}h\d{2}$/;

/** Schéma config hebdomadaire (un Planning par jour de semaine). */
export const updatePlanningSchema = z.object({
  jourSemaine: z.number().int().min(0).max(6),
  actif: z.boolean(),
  creneaux: z.array(z.string().regex(CRENEAU_REGEX, 'Créneau invalide')),
});
export type UpdatePlanningDTO = z.infer<typeof updatePlanningSchema>;

/** Schéma override ponctuel (vacances, jour férié, permanence). */
export const createJourSpecialSchema = z.object({
  date: z.coerce.date(),
  actif: z.boolean().default(false),
  creneaux: z
    .array(z.string().regex(CRENEAU_REGEX, 'Créneau invalide'))
    .default([]),
  motif: z.string().max(200).optional(),
});
export type CreateJourSpecialDTO = z.infer<typeof createJourSpecialSchema>;

export const updateJourSpecialSchema = createJourSpecialSchema.partial();
export type UpdateJourSpecialDTO = z.infer<typeof updateJourSpecialSchema>;
