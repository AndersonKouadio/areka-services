'use client';

import { useQuery } from '@tanstack/react-query';
import { planningAPI } from '../apis/planning.api';
import { planningKeyQuery } from './index.query';
import type { IJourSpecialParams } from '../types/planning.type';

export const useJoursSpeciauxListQuery = (params?: IJourSpecialParams) =>
  useQuery({
    queryKey: planningKeyQuery('jours-speciaux', params),
    queryFn: () => planningAPI.obtenirJoursSpeciaux(params),
    staleTime: 30 * 1000,
  });
