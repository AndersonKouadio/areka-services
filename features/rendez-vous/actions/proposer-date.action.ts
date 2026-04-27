'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { proposerDateRendezVousSchema } from '../schemas/rendez-vous.schema';
import { estCreneauOuvert } from '@/features/planning/actions/creneaux-resolver.action';
import { notifierRendezVous } from '@/features/notifications/actions/notifier-rdv.action';
import type { ActionResponse } from '@/types/api.type';
import type { RendezVous } from '@prisma/client';

export async function proposerAutreDateRendezVous(
  id: string,
  input: unknown
): Promise<ActionResponse<RendezVous>> {
  const session = await auth.api.getSession({ headers: await headers() });
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

  const rdv = await prisma.rendezVous.update({
    where: { id },
    data: {
      statut: 'PROPOSE_AUTRE_DATE',
      datePropose: parsed.data.datePropose,
      creneauPropose: parsed.data.creneauPropose,
      notesAdmin: parsed.data.message,
    },
  });

  notifierRendezVous(rdv, 'autre_date_proposee').catch((e) =>
    console.error('[notif] autre_date_proposee', e)
  );

  revalidatePath('/admin');
  return { success: true, data: rdv };
}
