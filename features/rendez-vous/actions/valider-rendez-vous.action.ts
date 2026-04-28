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

  /* Idempotence : ne valide QUE si EN_ATTENTE ou PROPOSE_AUTRE_DATE.
     Le `where` filtre sur les statuts admissibles. Si le RDV a déjà été
     traité (double-clic, refresh), updateMany retourne count=0 et on ne
     déclenche pas de notification en double. */
  const updated = await prisma.rendezVous.updateMany({
    where: {
      id,
      statut: { in: ['EN_ATTENTE', 'PROPOSE_AUTRE_DATE'] },
    },
    data: {
      statut: 'CONFIRME',
      notesAdmin: parsed.data.notesAdmin,
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

  notifierRendezVous(rdv, 'rdv_confirme').catch((e) =>
    console.error('[notif] rdv_confirme', e)
  );

  revalidatePath('/admin');
  return { success: true, data: rdv };
}
