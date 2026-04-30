import 'server-only';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-session';
import type { IRendezVousParams } from '../types/rendez-vous.type';
import type { PaginatedResponse } from '@/types/api.type';
import type { RendezVous } from '@prisma/client';

/**
 * Getters server-only pour les RDV.
 * Importés directement par les Server Components et les Route Handlers.
 * Les Client Components passent par features/rendez-vous/apis/.
 *
 * Pas de directive 'use server' : ce fichier ne doit JAMAIS être bundlé
 * côté client. L'import 'server-only' fait crasher le build si quelqu'un
 * essaie.
 */

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Non autorisé');
  return session;
}

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
