'use client';

import { apiClient } from '@/lib/api-client';
import type { TourneeJour } from '../types/tournee.type';

export const tourneeAPI = {
  obtenirJour: (date: Date) =>
    apiClient.get<TourneeJour>('/api/tournee', {
      params: { date: date.toISOString() },
    }),
};
