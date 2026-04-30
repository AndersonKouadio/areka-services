import { NextResponse } from 'next/server';
import { obtenirPlanningHebdo } from '@/features/planning/data/planning.data';

/**
 * GET /api/planning
 * Config hebdomadaire des créneaux ouverts (7 records).
 * Public — utilisé aussi par le formulaire RDV pour vérifier les jours ouverts.
 */
export async function GET() {
  try {
    const data = await obtenirPlanningHebdo();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[GET /api/planning]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
