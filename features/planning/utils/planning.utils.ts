/**
 * Helpers de formatage pour les créneaux et jours.
 * Pas de hardcode — la config vit en DB (model Planning).
 */

const CRENEAU_REGEX = /^(\d{1,2})h(\d{2})-(\d{1,2})h(\d{2})$/;

/** Vérifie le format d'un créneau "8h30-9h30". */
export function estFormatCreneauValide(creneau: string): boolean {
  return CRENEAU_REGEX.test(creneau);
}

/** "8h30-9h30" → "8h30 — 9h30" */
export function formaterCreneau(creneau: string): string {
  return creneau.replace('-', ' — ');
}

/** Formate une date en "lundi 27 avril". */
export function formaterJour(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Compare 2 créneaux pour tri (8h30 < 9h30 < 13h30...). */
export function comparerCreneaux(a: string, b: string): number {
  const matchA = a.match(CRENEAU_REGEX);
  const matchB = b.match(CRENEAU_REGEX);
  if (!matchA || !matchB) return a.localeCompare(b);
  const minutesA = parseInt(matchA[1], 10) * 60 + parseInt(matchA[2], 10);
  const minutesB = parseInt(matchB[1], 10) * 60 + parseInt(matchB[2], 10);
  return minutesA - minutesB;
}
