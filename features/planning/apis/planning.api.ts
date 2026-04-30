'use client';

import { apiClient } from '@/lib/api-client';
import type { Planning, JourSpecial } from '@prisma/client';
import type { IJourSpecialParams } from '../types/planning.type';

export const planningAPI = {
  obtenirHebdo: () => apiClient.get<Planning[]>('/api/planning'),

  obtenirJoursSpeciaux: (params?: IJourSpecialParams) =>
    apiClient.get<JourSpecial[]>('/api/jours-speciaux', {
      params: params as Record<string, string | boolean | undefined>,
    }),
};
