import 'server-only';

import prisma from '@/lib/prisma';
import type { Planning } from '@prisma/client';

/**
 * Getter server-only — config hebdomadaire des créneaux ouverts (7 records).
 * Importé par les Server Components et le Route Handler /api/planning.
 *
 * Pas d'auth ici : le planning est public (utilisé par le formulaire RDV).
 */
export async function obtenirPlanningHebdo(): Promise<Planning[]> {
  return prisma.planning.findMany({ orderBy: { jourSemaine: 'asc' } });
}
