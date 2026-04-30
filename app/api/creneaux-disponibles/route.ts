import { NextResponse, type NextRequest } from 'next/server';
import { obtenirCreneauxDisponibles } from '@/features/rendez-vous/actions/obtenir-creneaux-disponibles.action';

/**
 * GET /api/creneaux-disponibles?date=YYYY-MM-DD
 *
 * Endpoint public — utilisé par le formulaire de prise de RDV pour
 * filtrer les créneaux disponibles selon la date choisie.
 */
export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get('date');
  if (!dateParam) {
    return NextResponse.json(
      { error: 'Le paramètre "date" est requis (ISO ou YYYY-MM-DD).' },
      { status: 400 },
    );
  }
  const date = new Date(dateParam);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json(
      { error: 'Date invalide.' },
      { status: 400 },
    );
  }
  try {
    const result = await obtenirCreneauxDisponibles(date);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/creneaux-disponibles]', error);
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 },
    );
  }
}
