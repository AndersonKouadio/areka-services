import { NextResponse } from 'next/server';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import type { RendezVous } from '@prisma/client';
import prisma from '@/lib/prisma';
import { notifierRendezVous } from '@/features/notifications/actions/notifier-rdv.action';

/**
 * Cron job — appelé chaque jour vers 18h par Vercel Cron.
 * Envoie un rappel J-1 (email + SMS) à tous les clients ayant un RDV CONFIRME demain.
 *
 * Sécurité : header `Authorization: Bearer ${CRON_SECRET}` (Vercel l'ajoute automatiquement).
 */
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: 'Cron non configuré (CRON_SECRET manquant)' },
      { status: 503 }
    );
  }
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const demain = addDays(new Date(), 1);

  const rdvs = await prisma.rendezVous.findMany({
    where: {
      dateRDV: { gte: startOfDay(demain), lt: endOfDay(demain) },
      statut: 'CONFIRME',
      // Idempotence : ne pas re-envoyer si déjà rappelé
      rappelEnvoye: false,
    },
  });

  const results = await Promise.allSettled(
    rdvs.map(async (rdv: RendezVous) => {
      await notifierRendezVous(rdv, 'rappel_j1');
      // Marquer comme envoyé pour éviter doublon si re-cron
      await prisma.rendezVous.update({
        where: { id: rdv.id },
        data: { rappelEnvoye: true, rappelEnvoyeAt: new Date() },
      });
    })
  );

  const reussis = results.filter((r) => r.status === 'fulfilled').length;
  const echecs = results.filter((r) => r.status === 'rejected').length;

  console.log(
    `[cron rappels] ${rdvs.length} RDV demain · ${reussis} ok · ${echecs} échecs`
  );

  return NextResponse.json({
    rdvs: rdvs.length,
    reussis,
    echecs,
  });
}
