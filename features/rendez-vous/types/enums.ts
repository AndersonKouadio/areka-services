/**
 * Enums RDV — versions string-literal sans dépendance Prisma.
 *
 * À utiliser dans les Client Components et tout code bundlé pour le browser.
 * Les Server Components/Actions peuvent continuer à importer depuis '@prisma/client'.
 *
 * Bug évité : `@prisma/client` chargé dans un Client Component fait crasher le build
 * Turbopack (Module not found '.prisma/client/index-browser').
 */

export const TypeIntervention = {
  ENTRETIEN: 'ENTRETIEN',
  DEPANNAGE: 'DEPANNAGE',
  PANNE_URGENTE: 'PANNE_URGENTE',
} as const;
export type TypeIntervention =
  (typeof TypeIntervention)[keyof typeof TypeIntervention];

export const StatutRDV = {
  EN_ATTENTE: 'EN_ATTENTE',
  CONFIRME: 'CONFIRME',
  REFUSE: 'REFUSE',
  PROPOSE_AUTRE_DATE: 'PROPOSE_AUTRE_DATE',
  TERMINE: 'TERMINE',
  ANNULE: 'ANNULE',
} as const;
export type StatutRDV = (typeof StatutRDV)[keyof typeof StatutRDV];

export const SourceRDV = {
  FORMULAIRE: 'FORMULAIRE',
  MANUEL: 'MANUEL',
} as const;
export type SourceRDV = (typeof SourceRDV)[keyof typeof SourceRDV];

export const UserRole = {
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Re-exports type-only depuis Prisma — erasés au compile.
 * Sûrs pour les Client Components.
 */
export type {
  RendezVous,
  Planning,
  JourSpecial,
  User,
  Session,
  Account,
} from '@prisma/client';
