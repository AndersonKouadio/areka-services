import { z } from 'zod';
import { TypeIntervention } from '@prisma/client';

const TELEPHONE_REGEX = /^(?:(?:\+33|0033|0)\s?[1-9](?:[\s.-]?\d{2}){4})$/;

/**
 * Schéma client public — soumission du formulaire de prise de RDV.
 * Utilisé côté client (react-hook-form) ET côté serveur (Server Action).
 */
export const createRendezVousSchema = z.object({
  clientNom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  clientPrenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  clientEmail: z.string().email('Email invalide'),
  clientTelephone: z
    .string()
    .regex(TELEPHONE_REGEX, 'Numéro de téléphone français invalide'),
  clientAdresse: z.string().min(5, 'Adresse trop courte'),
  type: z.nativeEnum(TypeIntervention),
  description: z.string().max(2000, 'Description trop longue').optional(),
  dateRDV: z.date(),
  creneau: z.string().regex(/^\d{1,2}h\d{2}-\d{1,2}h\d{2}$/, 'Créneau invalide'),
});

export type CreateRendezVousDTO = z.infer<typeof createRendezVousSchema>;

/**
 * Schéma admin — modification manuelle d'un RDV.
 */
export const updateRendezVousSchema = createRendezVousSchema.partial().extend({
  notesAdmin: z.string().max(2000).optional(),
});
export type UpdateRendezVousDTO = z.infer<typeof updateRendezVousSchema>;

/**
 * Schéma validation : le RDV peut être validé tel quel ou avec des modifs.
 */
export const validerRendezVousSchema = z.object({
  notesAdmin: z.string().max(2000).optional(),
});
export type ValiderRendezVousDTO = z.infer<typeof validerRendezVousSchema>;

/**
 * Schéma refus : motif obligatoire.
 */
export const refuserRendezVousSchema = z.object({
  motifRefus: z.string().min(5, 'Motif requis (5 caractères min)'),
});
export type RefuserRendezVousDTO = z.infer<typeof refuserRendezVousSchema>;

/**
 * Schéma proposition d'autre date.
 */
export const proposerDateRendezVousSchema = z.object({
  datePropose: z.date(),
  creneauPropose: z
    .string()
    .regex(/^\d{1,2}h\d{2}-\d{1,2}h\d{2}$/, 'Créneau invalide'),
  message: z.string().max(500).optional(),
});
export type ProposerDateRendezVousDTO = z.infer<
  typeof proposerDateRendezVousSchema
>;
