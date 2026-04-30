import 'server-only';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-session';
import type { JourSpecial } from '@prisma/client';
import type { IJourSpecialParams } from '../types/planning.type';

/**
 * Getter server-only — liste les jours spéciaux (admin).
 * Importé par les Server Components et le Route Handler /api/jours-speciaux.
 */
export async function obtenirToursJoursSpeciaux(
  params?: IJourSpecialParams
): Promise<JourSpecial[]> {
  const session = await getSession();
  if (!session) throw new Error('Non autorisé');

  const { dateDebut, dateFin, actif } = params ?? {};
  return prisma.jourSpecial.findMany({
    where: {
      ...(dateDebut || dateFin
        ? {
            date: {
              ...(dateDebut ? { gte: new Date(dateDebut) } : {}),
              ...(dateFin ? { lte: new Date(dateFin) } : {}),
            },
          }
        : {}),
      ...(actif !== undefined ? { actif } : {}),
    },
    orderBy: { date: 'asc' },
  });
}
