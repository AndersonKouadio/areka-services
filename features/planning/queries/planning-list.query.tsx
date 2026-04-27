'use client';

import { useQuery } from '@tanstack/react-query';
import { obtenirPlanningHebdo } from '../actions/planning.actions';
import { planningKeyQuery } from './index.query';

export const usePlanningHebdoQuery = () =>
  useQuery({
    queryKey: planningKeyQuery('hebdo'),
    queryFn: () => obtenirPlanningHebdo(),
    staleTime: 60 * 1000,
  });
