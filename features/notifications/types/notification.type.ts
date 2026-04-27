export type EvenementRendezVous =
  | 'demande_recue'
  | 'rdv_confirme'
  | 'rdv_refuse'
  | 'autre_date_proposee'
  | 'rappel_j1';

export interface ResultatNotification {
  email: { client: boolean; admin: boolean };
  sms: { client: boolean; admin: boolean };
}
