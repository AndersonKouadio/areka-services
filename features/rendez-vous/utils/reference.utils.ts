/**
 * Génère une référence unique pour un RDV.
 * Format : AREKA-MMYY-XXXXXX (ex: AREKA-0426-A3F7K2)
 */
export function genererReferenceRendezVous(): string {
  const date = new Date();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear().toString().slice(-2);
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AREKA-${m}${y}-${rand}`;
}
