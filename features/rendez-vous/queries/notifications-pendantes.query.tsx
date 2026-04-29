'use client';

import { useQuery } from '@tanstack/react-query';
import { obtenirTousRendezVous } from '../actions/rendez-vous.actions';
import { rendezVousKeyQuery } from './index.query';
import type { IRendezVousParams } from '../types/rendez-vous.type';

const PARAMS: IRendezVousParams = {
  statut: 'EN_ATTENTE',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  limit: 50,
};

export const useNotificationsPendantesQuery = () =>
  useQuery({
    queryKey: rendezVousKeyQuery('list', PARAMS),
    queryFn: () => obtenirTousRendezVous(PARAMS),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false,
  });
