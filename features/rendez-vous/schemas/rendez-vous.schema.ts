import { z } from 'zod';
import { TypeIntervention } from '@prisma/client';

const TELEPHONE_REGEX = /^(?:(?:\+33|0033|0)\s?[1-9](?:[\s.-]?\d{2}){4})$/;
const CRENEAU_REGEX = /^\d{1,2}h\d{2}-\d{1,2}h\d{2}$/;

/** Date >= aujourd'hui (refuse les dates passées côté serveur). */
const dateFutureOuAujourdhui = z.date().refine(
  (d) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  },
  { message: 'La date doit être aujourd\'hui ou ultérieure' }
);

/**
 * Schéma client public — soumission du formulaire de prise de RDV.
 * Utilisé côté client (react-hook-form) ET côté serveur (Server Action).
 *
 * Tous les inputs string sont .trim() pour éviter les espaces parasites
 * (qui passeraient le min(2) avec une chaîne vide visuellement).
 */
export const createRendezVousSchema = z.object({
  clientNom: z
    .string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Nom trop long'),
  clientPrenom: z
    .string()
    .trim()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Prénom trop long'),
  clientEmail: z.string().trim().toLowerCase().email('Email invalide').max(254),
  clientTelephone: z
    .string()
    .trim()
    .regex(TELEPHONE_REGEX, 'Numéro de téléphone français invalide'),
  clientAdresse: z
    .string()
    .trim()
    .min(5, 'Adresse trop courte')
    .max(300, 'Adresse trop longue'),
  type: z.nativeEnum(TypeIntervention),
  description: z
    .string()
    .trim()
    .max(2000, 'Description trop longue')
    .optional(),
  dateRDV: dateFutureOuAujourdhui,
  creneau: z.string().trim().regex(CRENEAU_REGEX, 'Créneau invalide'),
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
  motifRefus: z.string().trim().min(5, 'Motif requis (5 caractères min)').max(500),
});
export type RefuserRendezVousDTO = z.infer<typeof refuserRendezVousSchema>;

/**
 * Schéma proposition d'autre date.
 */
export const proposerDateRendezVousSchema = z.object({
  datePropose: dateFutureOuAujourdhui,
  creneauPropose: z.string().trim().regex(CRENEAU_REGEX, 'Créneau invalide'),
  message: z.string().trim().max(500).optional(),
});
export type ProposerDateRendezVousDTO = z.infer<
  typeof proposerDateRendezVousSchema
>;
