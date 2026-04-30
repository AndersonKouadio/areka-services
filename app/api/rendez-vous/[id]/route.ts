import { NextResponse, type NextRequest } from 'next/server';
import { obtenirRendezVousParId } from '@/features/rendez-vous/data/rendez-vous.data';

/**
 * GET /api/rendez-vous/{id}
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const rdv = await obtenirRendezVousParId(id);
    if (!rdv) {
      return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    }
    return NextResponse.json(rdv);
  } catch (error) {
    if (error instanceof Error && error.message === 'Non autorisé') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    console.error('[GET /api/rendez-vous/[id]]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
