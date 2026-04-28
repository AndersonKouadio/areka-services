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

/** Parse "8h30-9h30" → bornes en minutes depuis minuit, ou null si invalide. */
export function parseCreneau(
  creneau: string
): { startMin: number; endMin: number } | null {
  const m = creneau.match(CRENEAU_REGEX);
  if (!m) return null;
  const startMin = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  const endMin = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
  return { startMin, endMin };
}

/** Renvoie un message d'erreur si le créneau est invalide (format / start>=end / hors plage). */
export function validerCreneau(creneau: string): string | null {
  const p = parseCreneau(creneau);
  if (!p) return 'Format invalide (ex : 8h30-9h30)';
  if (p.startMin >= p.endMin) return 'L\'heure de fin doit être après le début';
  if (p.endMin > 24 * 60) return 'Heure de fin hors plage (max 23h59)';
  if (p.startMin < 0) return 'Heure de début invalide';
  return null;
}

/** Détecte des créneaux qui se chevauchent dans une liste. */
export function detecterChevauchement(creneaux: string[]): string | null {
  const parsed = creneaux
    .map(parseCreneau)
    .filter((p): p is { startMin: number; endMin: number } => p !== null)
    .sort((a, b) => a.startMin - b.startMin);
  for (let i = 1; i < parsed.length; i++) {
    if (parsed[i].startMin < parsed[i - 1].endMin) {
      return 'Créneaux qui se chevauchent';
    }
  }
  return null;
}

/** Renvoie true si le créneau commence avant midi (matin). */
export function estMatin(creneau: string): boolean {
  const p = parseCreneau(creneau);
  return !!p && p.startMin < 12 * 60;
}

/** Sépare les créneaux en matin / après-midi pour l'affichage. */
export function grouperCreneauxMatinAprem(creneaux: string[]): {
  matin: string[];
  aprem: string[];
} {
  const matin: string[] = [];
  const aprem: string[] = [];
  for (const c of creneaux) {
    if (estMatin(c)) matin.push(c);
    else aprem.push(c);
  }
  return { matin, aprem };
}
