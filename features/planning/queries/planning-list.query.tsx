'use client';

import { useQuery } from '@tanstack/react-query';
import { planningAPI } from '../apis/planning.api';
import { planningKeyQuery } from './index.query';

export const usePlanningHebdoQuery = () =>
  useQuery({
    queryKey: planningKeyQuery('hebdo'),
    queryFn: () => planningAPI.obtenirHebdo(),
    staleTime: 60 * 1000,
  });
