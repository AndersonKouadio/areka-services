import { NextResponse, type NextRequest } from 'next/server';
import { obtenirToursJoursSpeciaux } from '@/features/planning/data/jour-special.data';

/**
 * GET /api/jours-speciaux?dateDebut=...&dateFin=...&actif=true
 * Liste les jours spéciaux (admin).
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const params = {
    dateDebut: sp.get('dateDebut') ?? undefined,
    dateFin: sp.get('dateFin') ?? undefined,
    actif:
      sp.get('actif') === 'true'
        ? true
        : sp.get('actif') === 'false'
        ? false
        : undefined,
  };
  try {
    const data = await obtenirToursJoursSpeciaux(params);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'Non autorisé') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    console.error('[GET /api/jours-speciaux]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
