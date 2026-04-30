import { NextResponse, type NextRequest } from 'next/server';
import { autocompleterAdresse } from '@/features/rendez-vous/actions/autocomplete-adresse.action';

/**
 * GET /api/geocode/autocomplete?q=12+rue+de+la+paix
 *
 * Endpoint public — utilisé par le composant AdresseAutocomplete pour
 * récupérer des suggestions Pelias (proxy ORS, masque la clé API).
 *
 * Note : l'auth n'est PAS requise côté client (formulaire public RDV),
 * mais la clé ORS reste server-side. On limite la longueur du query
 * pour éviter les abus.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  if (q.length > 200) {
    return NextResponse.json({ ok: false, error: 'Query trop long.' }, { status: 400 });
  }
  const result = await autocompleterAdresse(q);
  return NextResponse.json(result);
}
