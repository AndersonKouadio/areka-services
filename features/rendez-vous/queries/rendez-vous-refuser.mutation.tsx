'use client';

import { useMutation } from '@tanstack/react-query';
import { refuserRendezVous } from '../actions/refuser-rendez-vous.action';
import { useInvalidateRendezVousQuery } from './index.query';

export const useRefuserRendezVousMutation = () => {
  const invalidate = useInvalidateRendezVousQuery();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      refuserRendezVous(id, data),
    onSuccess: () => invalidate(),
  });
};
