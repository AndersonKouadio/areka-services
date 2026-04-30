'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-session';
import { refuserRendezVousSchema } from '../schemas/rendez-vous.schema';
import { notifierRendezVous } from '@/features/notifications/actions/notifier-rdv.action';
import type { ActionResponse } from '@/types/api.type';
import type { RendezVous } from '@prisma/client';

export async function refuserRendezVous(
  id: string,
  input: unknown
): Promise<ActionResponse<RendezVous>> {
  const session = await getSession();
  if (!session) return { success: false, error: 'Non autorisé' };

  const parsed = refuserRendezVousSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Motif de refus requis',
    };
  }

  // Idempotence : ne refuse QUE depuis EN_ATTENTE ou PROPOSE_AUTRE_DATE
  const updated = await prisma.rendezVous.updateMany({
    where: {
      id,
      statut: { in: ['EN_ATTENTE', 'PROPOSE_AUTRE_DATE'] },
    },
    data: {
      statut: 'REFUSE',
      motifRefus: parsed.data.motifRefus,
    },
  });

  if (updated.count === 0) {
    const current = await prisma.rendezVous.findUnique({
      where: { id },
      select: { statut: true },
    });
    if (!current) return { success: false, error: 'RDV introuvable' };
    return {
      success: false,
      error: `RDV déjà traité (statut : ${current.statut})`,
    };
  }

  const rdv = await prisma.rendezVous.findUniqueOrThrow({ where: { id } });

  notifierRendezVous(rdv, 'rdv_refuse').catch((e) =>
    console.error('[notif] rdv_refuse', e)
  );

  revalidatePath('/admin');
  return { success: true, data: rdv };
}
