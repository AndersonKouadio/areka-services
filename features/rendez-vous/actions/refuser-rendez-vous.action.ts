'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { refuserRendezVousSchema } from '../schemas/rendez-vous.schema';
import { notifierRendezVous } from '@/features/notifications/actions/notifier-rdv.action';
import type { ActionResponse } from '@/types/api.type';
import type { RendezVous } from '@prisma/client';

export async function refuserRendezVous(
  id: string,
  input: unknown
): Promise<ActionResponse<RendezVous>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Non autorisé' };

  const parsed = refuserRendezVousSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Motif de refus requis',
    };
  }

  const rdv = await prisma.rendezVous.update({
    where: { id },
    data: {
      statut: 'REFUSE',
      motifRefus: parsed.data.motifRefus,
    },
  });

  notifierRendezVous(rdv, 'rdv_refuse').catch((e) =>
    console.error('[notif] rdv_refuse', e)
  );

  revalidatePath('/admin');
  return { success: true, data: rdv };
}
