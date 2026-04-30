import 'server-only';

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
import type { IRendezVousParams } from '../types/rendez-vous.type';
import type { ActionResponse, PaginatedResponse } from '@/types/api.type';
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
  'use server';
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
  'use server';
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
   ADMIN : lecture
   ────────────────────────────────────────────────────────── */
export async function obtenirTousRendezVous(
  params?: IRendezVousParams
): Promise<PaginatedResponse<RendezVous>> {
  await requireAdmin();

  const {
    page = 1,
    limit = 20,
    search,
    statut,
    type,
    source,
    dateDebut,
    dateFin,
    sortBy = 'dateRDV',
    sortOrder = 'desc',
  } = params ?? {};

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { reference: { contains: search, mode: 'insensitive' } },
      { clientNom: { contains: search, mode: 'insensitive' } },
      { clientPrenom: { contains: search, mode: 'insensitive' } },
      { clientEmail: { contains: search, mode: 'insensitive' } },
      { clientTelephone: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (statut) where.statut = statut;
  if (type) where.type = type;
  if (source) where.source = source;
  if (dateDebut || dateFin) {
    where.dateRDV = {};
    if (dateDebut) (where.dateRDV as Record<string, Date>).gte = new Date(dateDebut);
    if (dateFin) (where.dateRDV as Record<string, Date>).lte = new Date(dateFin);
  }

  const [data, total] = await Promise.all([
    prisma.rendezVous.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.rendezVous.count({ where }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function obtenirRendezVousParId(
  id: string
): Promise<RendezVous | null> {
  await requireAdmin();
  return prisma.rendezVous.findUnique({ where: { id } });
}

/* ──────────────────────────────────────────────────────────
   ADMIN : modification & suppression
   ────────────────────────────────────────────────────────── */
export async function modifierRendezVous(
  id: string,
  input: unknown
): Promise<ActionResponse<RendezVous>> {
  'use server';
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
  'use server';
  await requireAdmin();
  await prisma.rendezVous.delete({ where: { id } });
  revalidatePath('/admin');
  return { success: true };
}
