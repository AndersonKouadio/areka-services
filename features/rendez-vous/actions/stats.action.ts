import 'server-only';

import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-session';

export interface StatsRendezVous {
  total: number;
  enAttente: number;
  confirmesAujourdhui: number;
  semaineCourante: number;
}

export async function obtenirStatsRendezVous(): Promise<StatsRendezVous> {
  const session = await getSession();
  if (!session) throw new Error('Non autorisé');

  const now = new Date();
  const [total, enAttente, confirmesAujourdhui, semaineCourante] =
    await Promise.all([
      prisma.rendezVous.count(),
      prisma.rendezVous.count({ where: { statut: 'EN_ATTENTE' } }),
      prisma.rendezVous.count({
        where: {
          statut: 'CONFIRME',
          dateRDV: { gte: startOfDay(now), lt: endOfDay(now) },
        },
      }),
      prisma.rendezVous.count({
        where: {
          dateRDV: {
            gte: startOfWeek(now, { weekStartsOn: 1 }),
            lte: endOfWeek(now, { weekStartsOn: 1 }),
          },
          statut: { in: ['CONFIRME', 'EN_ATTENTE'] },
        },
      }),
    ]);

  return { total, enAttente, confirmesAujourdhui, semaineCourante };
}
