'use client';

import { useMutation } from '@tanstack/react-query';
import {
  modifierRendezVous,
  supprimerRendezVous,
  ajouterRendezVousManuel,
} from '../actions/rendez-vous.actions';
import { useInvalidateRendezVousQuery } from './index.query';

export const useModifierRendezVousMutation = () => {
  const invalidate = useInvalidateRendezVousQuery();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      modifierRendezVous(id, data),
    onSuccess: () => invalidate(),
  });
};

export const useSupprimerRendezVousMutation = () => {
  const invalidate = useInvalidateRendezVousQuery();
  return useMutation({
    mutationFn: supprimerRendezVous,
    onSuccess: () => invalidate(),
  });
};

export const useAjouterRendezVousManuelMutation = () => {
  const invalidate = useInvalidateRendezVousQuery();
  return useMutation({
    mutationFn: ajouterRendezVousManuel,
    onSuccess: () => invalidate(),
  });
};
