'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { rendezVousAPI } from '../apis/rendez-vous.api';
import { rendezVousKeyQuery } from './index.query';
import type { IRendezVousParams } from '../types/rendez-vous.type';

export const useRendezVousListQuery = (params?: IRendezVousParams) =>
  useQuery({
    queryKey: rendezVousKeyQuery('list', params),
    queryFn: () => rendezVousAPI.obtenirTous(params),
    // 2 min — revisiter la page dans cet intervalle utilise le cache pur,
    // pas de refetch ni spinner. Les mutations (create/update/delete)
    // invalident explicitement via useInvalidateRendezVousQuery donc on
    // ne perd jamais la fraîcheur après une action utilisateur.
    staleTime: 2 * 60 * 1000,
    // Garde la liste précédente affichée pendant le re-fetch (filtres, pagination).
    placeholderData: keepPreviousData,
  });
