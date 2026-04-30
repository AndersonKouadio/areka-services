'use client';

import { useQuery } from '@tanstack/react-query';
import { rendezVousAPI } from '../apis/rendez-vous.api';
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
    queryFn: () => rendezVousAPI.obtenirTous(PARAMS),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false,
  });
