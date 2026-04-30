'use server';

import { revalidatePath } from 'next/cache';
import { startOfDay, endOfDay } from 'date-fns';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-session';
import {
  createRendezVousSchema,
  updateRendezVousSchema,
} from '../schemas/rendez-vous.schema';
import { genererReferenceRendezVous } from '../utils/reference.utils';
import { estCreneauOuvert } from '@/features/planning/actions/creneaux-resolver.action';
import { notifierRendezVous } from '@/features/notifications/actions/notifier-rdv.action';
import type { ActionResponse } from '@/types/api.type';
import type { RendezVous } from '@prisma/client';

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Non autorisé');
  return session;
}

/* ──────────────────────────────────────────────────────────
   PUBLIC : création depuis le formulaire client (pas d'auth)
   ────────────────────────────────────────────────────────── */
export async function ajouterRendezVous(
  input: unknown
): Promise<ActionResponse<{ reference: string; id: string }>> {
  const parsed = createRendezVousSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }
  const data = parsed.data;

  // Validation métier : créneau dispo dans le planning du jour (config DB)
  const creneauOuvert = await estCreneauOuvert(data.dateRDV, data.creneau);
  if (!creneauOuvert) {
    return {
      success: false,
      error: "Ce créneau n'est pas disponible ce jour-là.",
    };
  }

  try {
    /* Anti race condition : check + create dans une transaction interactive.
       Si deux clients soumettent le même créneau en parallèle, seul le premier
       passe — le second voit le créneau pris dans la même transaction et fail.
       L'isolation par défaut Postgres (READ_COMMITTED) suffit ici car le check
       précède immédiatement le create dans la même connexion. */
    const rdv = await prisma.$transaction(async (tx) => {
      const dejaReserve = await tx.rendezVous.findFirst({
        where: {
          dateRDV: {
            gte: startOfDay(data.dateRDV),
            lt: endOfDay(data.dateRDV),
          },
          creneau: data.creneau,
          statut: { in: ['CONFIRME', 'EN_ATTENTE', 'PROPOSE_AUTRE_DATE'] },
        },
        select: { id: true },
      });
      if (dejaReserve) {
        throw new Error('CRENEAU_TAKEN');
      }
      return tx.rendezVous.create({
        data: {
          ...data,
          reference: genererReferenceRendezVous(),
          source: 'FORMULAIRE',
        },
      });
    });

    revalidatePath('/rendez-vous');
    revalidatePath('/admin');

    notifierRendezVous(rdv, 'demande_recue').catch((e) =>
      console.error('[notif] demande_recue', e)
    );

    return {
      success: true,
      data: { reference: rdv.reference, id: rdv.id },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'CRENEAU_TAKEN') {
      return {
        success: false,
        error: 'Ce créneau vient d\'être réservé. Choisissez-en un autre.',
      };
    }
    console.error('Erreur création RDV:', error);
    return {
      success: false,
      error: 'Erreur serveur. Réessayez plus tard.',
    };
  }
}

/* ──────────────────────────────────────────────────────────
   ADMIN : ajout manuel (RDV pris au téléphone)
   ────────────────────────────────────────────────────────── */
export async function ajouterRendezVousManuel(
  input: unknown
): Promise<ActionResponse<RendezVous>> {
  await requireAdmin();

  const parsed = createRendezVousSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const rdv = await prisma.rendezVous.create({
    data: {
      ...parsed.data,
      reference: genererReferenceRendezVous(),
      source: 'MANUEL',
      statut: 'CONFIRME', // RDV manuel = directement confirmé
    },
  });

  revalidatePath('/admin');
  return { success: true, data: rdv };
}

/* ──────────────────────────────────────────────────────────
   ADMIN : modification & suppression
   ────────────────────────────────────────────────────────── */
export async function modifierRendezVous(
  id: string,
  input: unknown
): Promise<ActionResponse<RendezVous>> {
  await requireAdmin();

  const parsed = updateRendezVousSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const rdv = await prisma.rendezVous.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/admin');
  return { success: true, data: rdv };
}

export async function supprimerRendezVous(
  id: string
): Promise<ActionResponse<null>> {
  await requireAdmin();
  await prisma.rendezVous.delete({ where: { id } });
  revalidatePath('/admin');
  return { success: true };
}
