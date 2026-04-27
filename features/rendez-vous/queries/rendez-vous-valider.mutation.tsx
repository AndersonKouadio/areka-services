'use client';

import { useMutation } from '@tanstack/react-query';
import { validerRendezVous } from '../actions/valider-rendez-vous.action';
import { useInvalidateRendezVousQuery } from './index.query';

export const useValiderRendezVousMutation = () => {
  const invalidate = useInvalidateRendezVousQuery();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: unknown }) =>
      validerRendezVous(id, data),
    onSuccess: () => invalidate(),
  });
};
