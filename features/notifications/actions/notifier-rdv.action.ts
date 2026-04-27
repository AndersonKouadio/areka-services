'use server';

import { resend, EMAIL_FROM, ADMIN_EMAIL } from '@/lib/email/resend';
import {
  emailDemandeRecueClient,
  emailNouvelleDemandeAdmin,
  emailRdvConfirmeClient,
  emailRdvRefuseClient,
  emailAutreDateProposeeClient,
  emailRappelClient,
} from '@/lib/email/templates';
import { envoyerSmsOctopush } from '@/lib/sms/octopush';
import {
  smsDemandeRecueClient,
  smsNouvelleDemandeAdmin,
  smsRdvConfirmeClient,
  smsRdvRefuseClient,
  smsAutreDateProposeeClient,
  smsRappelClient,
} from '@/lib/sms/templates';
import type { RendezVous } from '@prisma/client';
import type {
  EvenementRendezVous,
  ResultatNotification,
} from '../types/notification.type';

async function sendEmail(
  to: string,
  payload: { subject: string; html: string } | null
): Promise<boolean> {
  if (!payload || !resend) return false;
  try {
    const res = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: payload.subject,
      html: payload.html,
    });
    return !res.error;
  } catch (e) {
    console.error('[email] error', e);
    return false;
  }
}

async function sendSms(to: string, text: string | null): Promise<boolean> {
  if (!text) return false;
  const res = await envoyerSmsOctopush({ to, text });
  return res.success;
}

/**
 * Orchestrateur des notifications RDV.
 * Selon le cahier des charges (matrice client × technicien × événement).
 *
 * Fire-and-forget : les erreurs sont loggées mais ne bloquent pas l'action métier.
 */
export async function notifierRendezVous(
  rdv: RendezVous,
  evenement: EvenementRendezVous
): Promise<ResultatNotification> {
  const result: ResultatNotification = {
    email: { client: false, admin: false },
    sms: { client: false, admin: false },
  };

  switch (evenement) {
    case 'demande_recue': {
      // Client : email accusé + SMS court
      result.email.client = await sendEmail(
        rdv.clientEmail,
        emailDemandeRecueClient(rdv)
      );
      result.sms.client = await sendSms(
        rdv.clientTelephone,
        smsDemandeRecueClient(rdv)
      );
      // Admin : email détaillé + SMS alerte
      result.email.admin = await sendEmail(
        ADMIN_EMAIL,
        emailNouvelleDemandeAdmin(rdv)
      );
      result.sms.admin = await sendSms(
        process.env.ADMIN_PHONE ?? '+33769401093',
        smsNouvelleDemandeAdmin(rdv)
      );
      break;
    }

    case 'rdv_confirme': {
      result.email.client = await sendEmail(
        rdv.clientEmail,
        emailRdvConfirmeClient(rdv)
      );
      result.sms.client = await sendSms(
        rdv.clientTelephone,
        smsRdvConfirmeClient(rdv)
      );
      break;
    }

    case 'rdv_refuse': {
      result.email.client = await sendEmail(
        rdv.clientEmail,
        emailRdvRefuseClient(rdv)
      );
      result.sms.client = await sendSms(
        rdv.clientTelephone,
        smsRdvRefuseClient(rdv)
      );
      break;
    }

    case 'autre_date_proposee': {
      result.email.client = await sendEmail(
        rdv.clientEmail,
        emailAutreDateProposeeClient(rdv)
      );
      result.sms.client = await sendSms(
        rdv.clientTelephone,
        smsAutreDateProposeeClient(rdv)
      );
      break;
    }

    case 'rappel_j1': {
      result.email.client = await sendEmail(
        rdv.clientEmail,
        emailRappelClient(rdv)
      );
      result.sms.client = await sendSms(
        rdv.clientTelephone,
        smsRappelClient(rdv)
      );
      break;
    }
  }

  return result;
}
