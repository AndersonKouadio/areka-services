'use client';

import { useQuery } from '@tanstack/react-query';
import { obtenirTousRendezVous } from '../actions/rendez-vous.actions';
import { rendezVousKeyQuery } from './index.query';
import type { IRendezVousParams } from '../types/rendez-vous.type';

export const useRendezVousListQuery = (params?: IRendezVousParams) =>
  useQuery({
    queryKey: rendezVousKeyQuery('list', params),
    queryFn: () => obtenirTousRendezVous(params),
    staleTime: 30 * 1000,
  });
