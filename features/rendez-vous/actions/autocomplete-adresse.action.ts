import 'server-only';

import {
  autocompleteAdresse,
  OrsAutocompleteError,
  type SuggestionAdresse,
} from '@/lib/geo/openroute';

export type AutocompleteResult =
  | { ok: true; suggestions: SuggestionAdresse[] }
  | { ok: false; error: string };

/**
 * Wrap server-side de l'autocomplete ORS pour ne pas exposer la clé API
 * côté client. Action publique (utilisée par le formulaire de prise de RDV).
 *
 * Retourne un discriminated union plutôt que de throw : ça évite que les
 * erreurs traversent la frontière server action en mode "Server Error
 * générique" et préserve le message français pour l'affichage.
 *
 * Le hook côté client transforme un `ok: false` en throw pour que TanStack
 * Query passe en isError.
 */
export async function autocompleterAdresse(
  query: string
): Promise<AutocompleteResult> {
  try {
    const suggestions = await autocompleteAdresse(query, 5);
    return { ok: true, suggestions };
  } catch (e) {
    if (e instanceof OrsAutocompleteError) {
      return { ok: false, error: e.userMessage };
    }
    console.error('[autocompleterAdresse] erreur inattendue', e);
    return {
      ok: false,
      error: "Service de recherche d'adresse indisponible.",
    };
  }
}
