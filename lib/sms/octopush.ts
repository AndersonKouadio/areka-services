/**
 * Client minimal pour l'API Octopush (envoi SMS).
 * Doc : https://docs.octopush.com/
 *
 * Endpoint utilisé : POST /v1/public/sms-campaign/send
 * Auth : headers `api-login` + `api-key`
 *
 * Si les variables d'env ne sont pas définies, log un warning et skip (no-op).
 */

const OCTOPUSH_BASE = 'https://api.octopush.com';

export interface OctopushSendParams {
  /** Numéro au format E.164 : +33612345678 */
  to: string;
  /** Texte du SMS (max 160 caractères pour 1 SMS, sinon multi-SMS) */
  text: string;
  /** Sender ID (max 11 caractères, ex: "AREKA"). Default = OCTOPUSH_SENDER */
  sender?: string;
}

export async function envoyerSmsOctopush(params: OctopushSendParams): Promise<
  | { success: true; smsId?: string }
  | { success: false; error: string; skipped?: boolean }
> {
  const apiLogin = process.env.OCTOPUSH_API_LOGIN;
  const apiKey = process.env.OCTOPUSH_API_KEY;
  const defaultSender = process.env.OCTOPUSH_SENDER ?? 'AREKA';

  if (!apiLogin || !apiKey) {
    console.warn('[octopush] API key absente — SMS skipped:', params.to);
    return { success: false, error: 'OCTOPUSH_API_KEY non configuré', skipped: true };
  }

  // Normaliser le numéro : +33XXXXXXXXX
  const phone = normaliserNumero(params.to);
  if (!phone) {
    return { success: false, error: `Numéro invalide : ${params.to}` };
  }

  const text = params.text;
  if (text.length > 160) {
    console.warn(`[octopush] SMS long (${text.length} chars) — facturation possible en multi-SMS`);
  }

  try {
    const res = await fetch(`${OCTOPUSH_BASE}/v1/public/sms-campaign/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-login': apiLogin,
        'api-key': apiKey,
      },
      body: JSON.stringify({
        recipients: [{ phone_number: phone }],
        text,
        type: 'sms_premium',
        // Valeurs valides selon doc Octopush : 'alert' (transactionnel)
        // ou 'wholesale' (marketing). Toute autre valeur tombe en
        // marketing par défaut et exige la mention "STOP au 30101".
        purpose: 'alert',
        sender: params.sender ?? defaultSender,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[octopush] HTTP', res.status, errorText);
      return { success: false, error: `Octopush ${res.status}` };
    }

    const data = (await res.json()) as { ticket?: string };
    return { success: true, smsId: data.ticket };
  } catch (error) {
    console.error('[octopush] Network error', error);
    return { success: false, error: 'Erreur réseau Octopush' };
  }
}

/** Convertit un numéro FR vers le format E.164 (+33XXXXXXXXX). */
function normaliserNumero(input: string): string | null {
  const cleaned = input.replace(/[\s.-]/g, '');
  if (cleaned.startsWith('+33') && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith('0033') && cleaned.length === 13)
    return '+' + cleaned.slice(2);
  if (cleaned.startsWith('0') && cleaned.length === 10)
    return '+33' + cleaned.slice(1);
  return null;
}
