'use client';

import { useQuery } from '@tanstack/react-query';
import { obtenirToursJoursSpeciaux } from '../actions/jour-special.actions';
import { planningKeyQuery } from './index.query';
import type { IJourSpecialParams } from '../types/planning.type';

export const useJoursSpeciauxListQuery = (params?: IJourSpecialParams) =>
  useQuery({
    queryKey: planningKeyQuery('jours-speciaux', params),
    queryFn: () => obtenirToursJoursSpeciaux(params),
    staleTime: 30 * 1000,
  });
