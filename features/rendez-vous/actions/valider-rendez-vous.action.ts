'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validerRendezVousSchema } from '../schemas/rendez-vous.schema';
import { notifierRendezVous } from '@/features/notifications/actions/notifier-rdv.action';
import type { ActionResponse } from '@/types/api.type';
import type { RendezVous } from '@prisma/client';

export async function validerRendezVous(
  id: string,
  input?: unknown
): Promise<ActionResponse<RendezVous>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Non autorisé' };

  const parsed = validerRendezVousSchema.safeParse(input ?? {});
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const rdv = await prisma.rendezVous.update({
    where: { id },
    data: {
      statut: 'CONFIRME',
      notesAdmin: parsed.data.notesAdmin,
    },
  });

  notifierRendezVous(rdv, 'rdv_confirme').catch((e) =>
    console.error('[notif] rdv_confirme', e)
  );

  revalidatePath('/admin');
  return { success: true, data: rdv };
}
