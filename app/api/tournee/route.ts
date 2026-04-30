import { NextResponse, type NextRequest } from 'next/server';
import { calculerTourneeJour } from '@/features/tournee/actions/calculer-tournee.action';

/**
 * GET /api/tournee?date=YYYY-MM-DD
 * Calcule la tournée optimisée du jour (admin).
 */
export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get('date');
  if (!dateParam) {
    return NextResponse.json({ error: 'Paramètre "date" requis.' }, { status: 400 });
  }
  const date = new Date(dateParam);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
  }
  try {
    const tournee = await calculerTourneeJour(date);
    return NextResponse.json(tournee);
  } catch (error) {
    if (error instanceof Error && error.message === 'Non autorisé') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    console.error('[GET /api/tournee]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
