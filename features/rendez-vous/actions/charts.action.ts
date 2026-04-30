import 'server-only';

import { startOfDay, subDays, format } from 'date-fns';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-session';
import type { StatutRDV, TypeIntervention } from '../types/enums';

export interface DailyPoint {
  date: string; // yyyy-MM-dd
  total: number;
  confirme: number;
  enAttente: number;
  refuse: number;
}

export interface RepartitionItem<K extends string> {
  key: K;
  count: number;
}

export interface TrendPoint {
  date: string;
  demandes: number;
  confirmes: number;
}

export interface ChartsData {
  parJour14j: DailyPoint[];
  parType: RepartitionItem<TypeIntervention>[];
  parStatut: RepartitionItem<StatutRDV>[];
  tendance30j: TrendPoint[];
  totalActifs: number;
}

/**
 * Action admin — agrégations pour les graphiques du dashboard.
 * 1 query findMany large + agrégation côté JS pour éviter 4-5 round-trips.
 */
export async function obtenirChartsData(): Promise<ChartsData> {
  const session = await getSession();
  if (!session) throw new Error('Non autorisé');

  const today = startOfDay(new Date());
  const j30 = subDays(today, 30);
  const jPlus14 = subDays(today, -14);

  // Fenêtre la plus large = 30j passés sur createdAt OU dateRDV jusqu'à +14j
  const rdvs = await prisma.rendezVous.findMany({
    where: {
      OR: [
        { createdAt: { gte: j30 } },
        { dateRDV: { gte: j30, lte: jPlus14 } },
      ],
    },
    select: {
      type: true,
      statut: true,
      createdAt: true,
      dateRDV: true,
    },
  });

  // === Par jour : 7j passés + aujourd'hui + 6j futurs (vue planning) ===
  const parJourMap = new Map<string, DailyPoint>();
  for (let i = 0; i < 14; i++) {
    const d = subDays(today, 7 - i); // i=0 → today-7, i=7 → today, i=13 → today+6
    const key = format(d, 'yyyy-MM-dd');
    parJourMap.set(key, {
      date: key,
      total: 0,
      confirme: 0,
      enAttente: 0,
      refuse: 0,
    });
  }
  for (const r of rdvs) {
    const key = format(r.dateRDV, 'yyyy-MM-dd');
    const p = parJourMap.get(key);
    if (!p) continue;
    p.total++;
    if (r.statut === 'CONFIRME') p.confirme++;
    else if (r.statut === 'EN_ATTENTE' || r.statut === 'PROPOSE_AUTRE_DATE')
      p.enAttente++;
    else if (r.statut === 'REFUSE' || r.statut === 'ANNULE') p.refuse++;
  }
  const parJour14j = Array.from(parJourMap.values());

  // === Répartition par type (toute la fenêtre) ===
  const parTypeMap = new Map<TypeIntervention, number>();
  for (const r of rdvs) {
    parTypeMap.set(r.type, (parTypeMap.get(r.type) ?? 0) + 1);
  }
  const parType: RepartitionItem<TypeIntervention>[] = (
    ['ENTRETIEN', 'DEPANNAGE', 'PANNE_URGENTE'] as TypeIntervention[]
  ).map((k) => ({ key: k, count: parTypeMap.get(k) ?? 0 }));

  // === Répartition par statut ===
  const parStatutMap = new Map<StatutRDV, number>();
  for (const r of rdvs) {
    parStatutMap.set(r.statut, (parStatutMap.get(r.statut) ?? 0) + 1);
  }
  const parStatut: RepartitionItem<StatutRDV>[] = (
    [
      'EN_ATTENTE',
      'CONFIRME',
      'REFUSE',
      'PROPOSE_AUTRE_DATE',
      'TERMINE',
      'ANNULE',
    ] as StatutRDV[]
  ).map((k) => ({ key: k, count: parStatutMap.get(k) ?? 0 }));

  // === Tendance 30 jours basé sur createdAt (demandes) + dateRDV (confirmées) ===
  const trendMap = new Map<string, TrendPoint>();
  for (let i = 0; i < 30; i++) {
    const d = subDays(today, 29 - i);
    const key = format(d, 'yyyy-MM-dd');
    trendMap.set(key, { date: key, demandes: 0, confirmes: 0 });
  }
  for (const r of rdvs) {
    const dCreated = format(r.createdAt, 'yyyy-MM-dd');
    const dRdv = format(r.dateRDV, 'yyyy-MM-dd');
    const tCreated = trendMap.get(dCreated);
    if (tCreated) tCreated.demandes++;
    if (r.statut === 'CONFIRME') {
      const tRdv = trendMap.get(dRdv);
      if (tRdv) tRdv.confirmes++;
    }
  }
  const tendance30j = Array.from(trendMap.values());

  const totalActifs = rdvs.filter((r) =>
    ['EN_ATTENTE', 'CONFIRME', 'PROPOSE_AUTRE_DATE'].includes(r.statut)
  ).length;

  return { parJour14j, parType, parStatut, tendance30j, totalActifs };
}
