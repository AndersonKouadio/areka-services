'use client';

import { useQuery } from '@tanstack/react-query';
import { rendezVousAPI } from '../apis/rendez-vous.api';
import { rendezVousKeyQuery } from './index.query';

/**
 * Hook typeahead pour l'autocomplete d'adresse.
 * Garde-fous : query trim min 3 chars sinon disabled (économise les tokens ORS).
 * staleTime long (5 min) car les adresses ne bougent pas souvent.
 *
 * En cas d'erreur ORS, on tente 1 retry max (typeahead = best-effort,
 * inutile de spammer le service en panne).
 */
export const useAdresseAutocompleteQuery = (query: string) => {
  const trimmed = query.trim();
  return useQuery({
    queryKey: rendezVousKeyQuery('autocomplete-adresse', trimmed),
    queryFn: async () => {
      const result = await rendezVousAPI.autocompleteAdresse(trimmed);
      if (!result.ok) throw new Error(result.error);
      return result.suggestions;
    },
    enabled: trimmed.length >= 3,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};
