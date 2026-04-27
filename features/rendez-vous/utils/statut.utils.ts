import { StatutRDV, TypeIntervention, SourceRDV } from '@prisma/client';

/**
 * Libellés FR pour affichage UI.
 */
export const LIBELLE_STATUT: Record<StatutRDV, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRME: 'Confirmé',
  REFUSE: 'Refusé',
  PROPOSE_AUTRE_DATE: 'Autre date proposée',
  TERMINE: 'Terminé',
  ANNULE: 'Annulé',
};

export const LIBELLE_TYPE: Record<TypeIntervention, string> = {
  ENTRETIEN: 'Entretien',
  DEPANNAGE: 'Dépannage',
  PANNE_URGENTE: 'Panne urgente',
};

export const LIBELLE_SOURCE: Record<SourceRDV, string> = {
  FORMULAIRE: 'Formulaire en ligne',
  MANUEL: 'Saisie manuelle',
};

/**
 * Couleurs sémantiques (CSS variables Areka, cf. globals.css).
 */
export const COULEUR_STATUT: Record<StatutRDV, string> = {
  EN_ATTENTE: 'var(--status-attente)',
  CONFIRME: 'var(--status-confirme)',
  REFUSE: 'var(--areka-coral)',
  PROPOSE_AUTRE_DATE: 'var(--areka-amber)',
  TERMINE: 'var(--areka-green)',
  ANNULE: 'var(--muted-foreground)',
};

export const COULEUR_TYPE: Record<TypeIntervention, string> = {
  ENTRETIEN: 'var(--status-entretien)', // bleu marine
  DEPANNAGE: 'var(--status-depannage)', // orange
  PANNE_URGENTE: 'var(--status-urgence)', // framboise
};
