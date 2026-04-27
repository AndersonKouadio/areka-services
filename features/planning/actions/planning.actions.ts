'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { updatePlanningSchema } from '../schemas/planning.schema';
import type { ActionResponse } from '@/types/api.type';
import type { Planning } from '@prisma/client';

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Non autorisé');
  return session;
}

/** Lit toute la config hebdomadaire (7 records, un par jour). */
export async function obtenirPlanningHebdo(): Promise<Planning[]> {
  return prisma.planning.findMany({ orderBy: { jourSemaine: 'asc' } });
}

/** Met à jour la config d'un jour de la semaine (admin). */
export async function modifierPlanningJour(
  input: unknown
): Promise<ActionResponse<Planning>> {
  await requireAdmin();

  const parsed = updatePlanningSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const planning = await prisma.planning.upsert({
    where: { jourSemaine: parsed.data.jourSemaine },
    update: {
      actif: parsed.data.actif,
      creneaux: parsed.data.creneaux,
    },
    create: {
      jourSemaine: parsed.data.jourSemaine,
      actif: parsed.data.actif,
      creneaux: parsed.data.creneaux,
    },
  });

  revalidatePath('/admin/parametres');
  revalidatePath('/rendez-vous');
  return { success: true, data: planning };
}
