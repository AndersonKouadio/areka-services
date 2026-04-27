'use client';

import { useMutation } from '@tanstack/react-query';
import { ajouterRendezVous } from '../actions/rendez-vous.actions';
import { useInvalidateRendezVousQuery } from './index.query';

export const useAjouterRendezVousMutation = () => {
  const invalidate = useInvalidateRendezVousQuery();
  return useMutation({
    mutationFn: ajouterRendezVous,
    onSuccess: () => {
      invalidate();
    },
  });
};
