'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-session';
import { proposerDateRendezVousSchema } from '../schemas/rendez-vous.schema';
import { estCreneauOuvert } from '@/features/planning/actions/creneaux-resolver.action';
import { notifierRendezVous } from '@/features/notifications/actions/notifier-rdv.action';
import type { ActionResponse } from '@/types/api.type';
import type { RendezVous } from '@prisma/client';

export async function proposerAutreDateRendezVous(
  id: string,
  input: unknown
): Promise<ActionResponse<RendezVous>> {
  const session = await getSession();
  if (!session) return { success: false, error: 'Non autorisé' };

  const parsed = proposerDateRendezVousSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const creneauOuvert = await estCreneauOuvert(
    parsed.data.datePropose,
    parsed.data.creneauPropose
  );
  if (!creneauOuvert) {
    return {
      success: false,
      error: "Ce créneau n'est pas disponible ce jour-là.",
    };
  }

  // Idempotence : ne propose autre date QUE depuis EN_ATTENTE
  const updated = await prisma.rendezVous.updateMany({
    where: {
      id,
      statut: 'EN_ATTENTE',
    },
    data: {
      statut: 'PROPOSE_AUTRE_DATE',
      datePropose: parsed.data.datePropose,
      creneauPropose: parsed.data.creneauPropose,
      notesAdmin: parsed.data.message,
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

  notifierRendezVous(rdv, 'autre_date_proposee').catch((e) =>
    console.error('[notif] autre_date_proposee', e)
  );

  revalidatePath('/admin');
  return { success: true, data: rdv };
}
