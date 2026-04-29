'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { obtenirTousRendezVous } from '../actions/rendez-vous.actions';
import { rendezVousKeyQuery } from './index.query';
import type { IRendezVousParams } from '../types/rendez-vous.type';

export const useRendezVousListQuery = (params?: IRendezVousParams) =>
  useQuery({
    queryKey: rendezVousKeyQuery('list', params),
    queryFn: () => obtenirTousRendezVous(params),
    staleTime: 30 * 1000,
    // Garde la liste précédente affichée pendant le re-fetch (filtres, pagination).
    // Évite l'effet "page blanche → spinner → liste" à chaque changement de filtre.
    placeholderData: keepPreviousData,
  });
