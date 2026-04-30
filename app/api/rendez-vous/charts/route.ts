import { NextResponse } from 'next/server';
import { obtenirChartsData } from '@/features/rendez-vous/actions/charts.action';

/**
 * GET /api/rendez-vous/charts
 * Agrégats 30 derniers jours pour le dashboard admin.
 */
export async function GET() {
  try {
    const data = await obtenirChartsData();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'Non autorisé') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    console.error('[GET /api/rendez-vous/charts]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
