'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-session';
import {
  createJourSpecialSchema,
  updateJourSpecialSchema,
} from '../schemas/planning.schema';
import type { ActionResponse } from '@/types/api.type';
import type { JourSpecial } from '@prisma/client';
import type { IJourSpecialParams } from '../types/planning.type';

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Non autorisé');
  return session;
}

export async function obtenirToursJoursSpeciaux(
  params?: IJourSpecialParams
): Promise<JourSpecial[]> {
  await requireAdmin();
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

export async function ajouterJourSpecial(
  input: unknown
): Promise<ActionResponse<JourSpecial>> {
  await requireAdmin();

  const parsed = createJourSpecialSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const jour = await prisma.jourSpecial.upsert({
    where: { date: parsed.data.date },
    update: {
      actif: parsed.data.actif,
      creneaux: parsed.data.creneaux,
      motif: parsed.data.motif,
    },
    create: parsed.data,
  });

  revalidatePath('/admin/parametres');
  revalidatePath('/rendez-vous');
  return { success: true, data: jour };
}

export async function modifierJourSpecial(
  id: string,
  input: unknown
): Promise<ActionResponse<JourSpecial>> {
  await requireAdmin();

  const parsed = updateJourSpecialSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const jour = await prisma.jourSpecial.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/admin/parametres');
  revalidatePath('/rendez-vous');
  return { success: true, data: jour };
}

export async function supprimerJourSpecial(
  id: string
): Promise<ActionResponse<null>> {
  await requireAdmin();
  await prisma.jourSpecial.delete({ where: { id } });
  revalidatePath('/admin/parametres');
  revalidatePath('/rendez-vous');
  return { success: true };
}
