import { PUBLIC_URL } from './resend';
import { LIBELLE_TYPE } from '@/features/rendez-vous/utils/statut.utils';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { RendezVous } from '@prisma/client';

const NAVY = '#1E3A5F';
const ORANGE = '#F97316';
const CREAM = '#FAF7F2';

/**
 * Escape HTML pour éviter XSS : un client malveillant peut injecter
 * du HTML/JS via clientNom, description, motifRefus, etc.
 */
function esc(s: string | null | undefined): string {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Encode un email/téléphone pour href="tel:..." / "mailto:..."
 * (URL-encode les caractères dangereux)
 */
function encUri(s: string | null | undefined): string {
  return encodeURIComponent(String(s ?? ''));
}

function formaterDate(d: Date): string {
  return new Date(d).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function shell(title: string, body: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:${CREAM};padding:24px;border-radius:12px">
    <div style="background:linear-gradient(135deg,${ORANGE},#E11D48);padding:24px;border-radius:12px 12px 0 0;color:white">
      <h1 style="margin:0;font-size:22px;font-weight:700">${title}</h1>
      <p style="margin:6px 0 0;opacity:0.9;font-size:13px">Areka Services — Cholet</p>
    </div>
    <div style="background:white;padding:24px;border-radius:0 0 12px 12px">
      ${body}
      <hr style="margin:24px 0;border:none;border-top:1px solid #EAE3D5">
      <p style="font-size:12px;color:#888;line-height:1.6">
        Areka Services — Lieu-dit l'Hermitage, 49300 Cholet<br>
        07 69 40 10 93 — arekaservices@gmail.com
      </p>
    </div>
  </div>`;
}

function rdvDetails(rdv: RendezVous): string {
  return `<table style="width:100%;font-size:14px;color:#555;border-collapse:collapse;margin:12px 0">
    <tr><td style="padding:6px 0;font-weight:600;width:120px;color:${NAVY}">Référence</td><td style="font-family:ui-monospace,monospace">${esc(rdv.reference)}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;color:${NAVY}">Type</td><td>${esc(LIBELLE_TYPE[rdv.type])}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;color:${NAVY}">Date</td><td>${esc(formaterDate(rdv.dateRDV))}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;color:${NAVY}">Créneau</td><td>${esc(formaterCreneau(rdv.creneau))}</td></tr>
    ${rdv.description ? `<tr><td style="padding:6px 0;font-weight:600;color:${NAVY};vertical-align:top">Description</td><td>${esc(rdv.description)}</td></tr>` : ''}
  </table>`;
}

/** Email accusé réception — envoyé au client après soumission */
export function emailDemandeRecueClient(rdv: RendezVous) {
  return {
    subject: `Areka Services — Demande reçue (${rdv.reference})`,
    html: shell(
      'Demande reçue',
      `<p>Bonjour ${esc(rdv.clientPrenom)},</p>
       <p>Nous avons bien reçu votre demande de rendez-vous. Julien vous contactera sous 24h pour valider votre créneau.</p>
       ${rdvDetails(rdv)}
       <p style="margin-top:16px">À très bientôt,<br><strong>Julien Ligner</strong></p>`
    ),
  };
}

/** Email notification admin — envoyée à Julien à chaque nouvelle demande */
export function emailNouvelleDemandeAdmin(rdv: RendezVous) {
  return {
    subject: `[Areka] Nouvelle demande ${rdv.reference} — ${rdv.clientPrenom} ${rdv.clientNom}`,
    html: shell(
      'Nouvelle demande de RDV',
      `<p>Une nouvelle demande vient d'arriver.</p>
       ${rdvDetails(rdv)}
       <h3 style="color:${NAVY};font-size:14px;margin-top:20px">Client</h3>
       <table style="width:100%;font-size:14px;color:#555">
         <tr><td style="padding:4px 0;font-weight:600;width:120px">Nom</td><td>${esc(rdv.clientPrenom)} ${esc(rdv.clientNom)}</td></tr>
         <tr><td style="padding:4px 0;font-weight:600">Téléphone</td><td><a href="tel:${encUri(rdv.clientTelephone)}" style="color:${ORANGE}">${esc(rdv.clientTelephone)}</a></td></tr>
         <tr><td style="padding:4px 0;font-weight:600">Email</td><td><a href="mailto:${encUri(rdv.clientEmail)}" style="color:${ORANGE}">${esc(rdv.clientEmail)}</a></td></tr>
         <tr><td style="padding:4px 0;font-weight:600;vertical-align:top">Adresse</td><td>${esc(rdv.clientAdresse)}</td></tr>
       </table>
       <p style="margin-top:20px"><a href="${PUBLIC_URL}/admin/rendez-vous/${encodeURIComponent(rdv.id)}" style="background:${ORANGE};color:white;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Voir dans l'admin</a></p>`
    ),
  };
}

/** Email confirmation RDV — envoyé au client après validation admin */
export function emailRdvConfirmeClient(rdv: RendezVous) {
  return {
    subject: `Areka Services — RDV confirmé (${rdv.reference})`,
    html: shell(
      'Rendez-vous confirmé ✓',
      `<p>Bonjour ${esc(rdv.clientPrenom)},</p>
       <p>Votre rendez-vous est confirmé. Julien sera chez vous comme prévu.</p>
       ${rdvDetails(rdv)}
       ${rdv.notesAdmin ? `<p style="background:#f4efe6;padding:12px;border-radius:8px;font-size:13px"><strong>Note de Julien :</strong><br>${esc(rdv.notesAdmin)}</p>` : ''}
       <p>À bientôt !<br><strong>Julien Ligner</strong></p>`
    ),
  };
}

/** Email refus — envoyé au client */
export function emailRdvRefuseClient(rdv: RendezVous) {
  return {
    subject: `Areka Services — RDV non disponible (${rdv.reference})`,
    html: shell(
      'Rendez-vous non disponible',
      `<p>Bonjour ${esc(rdv.clientPrenom)},</p>
       <p>Nous ne pouvons malheureusement pas honorer votre demande de rendez-vous.</p>
       ${rdvDetails(rdv)}
       ${rdv.motifRefus ? `<p style="background:#fce7ec;padding:12px;border-radius:8px;font-size:13px"><strong>Motif :</strong><br>${esc(rdv.motifRefus)}</p>` : ''}
       <p>N'hésitez pas à nous contacter pour proposer un autre créneau.</p>
       <p><strong>Julien Ligner</strong> — 07 69 40 10 93</p>`
    ),
  };
}

/** Email proposition autre date — envoyé au client */
export function emailAutreDateProposeeClient(rdv: RendezVous) {
  if (!rdv.datePropose || !rdv.creneauPropose) return null;
  return {
    subject: `Areka Services — Nouvelle date proposée (${rdv.reference})`,
    html: shell(
      'Nouvelle date proposée',
      `<p>Bonjour ${esc(rdv.clientPrenom)},</p>
       <p>Julien vous propose une nouvelle date pour votre intervention :</p>
       <div style="background:#fff1e6;border-left:4px solid ${ORANGE};padding:12px 16px;margin:16px 0;border-radius:6px">
         <p style="margin:0;font-size:16px;font-weight:600;color:${NAVY}">${esc(formaterDate(rdv.datePropose))}</p>
         <p style="margin:4px 0 0;font-size:14px">Créneau : ${esc(formaterCreneau(rdv.creneauPropose))}</p>
       </div>
       ${rdv.notesAdmin ? `<p style="background:#f4efe6;padding:12px;border-radius:8px;font-size:13px">${esc(rdv.notesAdmin)}</p>` : ''}
       <p>Merci de répondre à cet email pour confirmer ou proposer une autre date.</p>
       <p><strong>Julien Ligner</strong> — 07 69 40 10 93</p>`
    ),
  };
}

/** Email rappel J-1 — envoyé la veille du RDV au client */
export function emailRappelClient(rdv: RendezVous) {
  return {
    subject: `Areka Services — Rappel : RDV demain (${rdv.reference})`,
    html: shell(
      'Rappel — RDV demain',
      `<p>Bonjour ${esc(rdv.clientPrenom)},</p>
       <p>Petit rappel : Julien intervient chez vous demain.</p>
       ${rdvDetails(rdv)}
       <p>À demain !<br><strong>Julien Ligner</strong></p>`
    ),
  };
}
