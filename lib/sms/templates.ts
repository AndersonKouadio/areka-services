import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { RendezVous } from '@prisma/client';

function dateCourte(d: Date): string {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Templates SMS — texte court, max 160 caractères pour 1 segment.
 * Sender ID = "AREKA" (configuré par défaut côté Octopush).
 */

export function smsDemandeRecueClient(rdv: RendezVous): string {
  return `Areka Services : votre demande RDV (${rdv.reference}) bien recue. Confirmation sous 24h. 07 69 40 10 93`;
}

export function smsNouvelleDemandeAdmin(rdv: RendezVous): string {
  return `[Areka] Nouvelle demande ${rdv.reference} de ${rdv.clientPrenom} ${rdv.clientNom} pour le ${dateCourte(rdv.dateRDV)} ${formaterCreneau(rdv.creneau)}.`;
}

export function smsRdvConfirmeClient(rdv: RendezVous): string {
  return `Areka Services : RDV confirme le ${dateCourte(rdv.dateRDV)} a ${formaterCreneau(rdv.creneau)}. A bientot !`;
}

export function smsRdvRefuseClient(rdv: RendezVous): string {
  return `Areka Services : votre RDV ${rdv.reference} n'a pas pu etre valide. Plus d'infos par email. 07 69 40 10 93`;
}

export function smsAutreDateProposeeClient(rdv: RendezVous): string | null {
  if (!rdv.datePropose || !rdv.creneauPropose) return null;
  return `Areka Services : nouvelle date proposee le ${dateCourte(rdv.datePropose)} a ${formaterCreneau(rdv.creneauPropose)}. Voir email.`;
}

export function smsRappelClient(rdv: RendezVous): string {
  return `Areka Services : rappel - RDV demain (${dateCourte(rdv.dateRDV)}) a ${formaterCreneau(rdv.creneau)}. A demain !`;
}
