import { NextResponse, type NextRequest } from 'next/server';
import { obtenirTousRendezVous } from '@/features/rendez-vous/data/rendez-vous.data';
import type { IRendezVousParams } from '@/features/rendez-vous/types/rendez-vous.type';
import type { StatutRDV, TypeIntervention, SourceRDV } from '@prisma/client';

/**
 * GET /api/rendez-vous?<filters>
 *
 * Endpoint protégé — auth vérifiée par obtenirTousRendezVous() qui throw
 * 'Non autorisé' si pas de session admin.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const params: IRendezVousParams = {
    page: sp.get('page') ? Number(sp.get('page')) : undefined,
    limit: sp.get('limit') ? Number(sp.get('limit')) : undefined,
    search: sp.get('search') ?? undefined,
    statut: (sp.get('statut') as StatutRDV) ?? undefined,
    type: (sp.get('type') as TypeIntervention) ?? undefined,
    source: (sp.get('source') as SourceRDV) ?? undefined,
    dateDebut: sp.get('dateDebut') ?? undefined,
    dateFin: sp.get('dateFin') ?? undefined,
    sortBy:
      (sp.get('sortBy') as 'dateRDV' | 'createdAt' | 'statut') ?? undefined,
    sortOrder: (sp.get('sortOrder') as 'asc' | 'desc') ?? undefined,
  };
  try {
    const result = await obtenirTousRendezVous(params);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Non autorisé') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    console.error('[GET /api/rendez-vous]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
