import { NextResponse } from 'next/server';
import { obtenirStatsRendezVous } from '@/features/rendez-vous/actions/stats.action';

/**
 * GET /api/rendez-vous/stats
 * Compteurs dashboard admin (total, en attente, aujourd'hui, semaine).
 */
export async function GET() {
  try {
    const stats = await obtenirStatsRendezVous();
    return NextResponse.json(stats);
  } catch (error) {
    if (error instanceof Error && error.message === 'Non autorisé') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    console.error('[GET /api/rendez-vous/stats]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
