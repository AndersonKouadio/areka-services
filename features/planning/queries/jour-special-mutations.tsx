'use client';

import { useMutation } from '@tanstack/react-query';
import {
  ajouterJourSpecial,
  modifierJourSpecial,
  supprimerJourSpecial,
} from '../actions/jour-special.actions';
import { useInvalidatePlanningQuery } from './index.query';

export const useAjouterJourSpecialMutation = () => {
  const invalidate = useInvalidatePlanningQuery();
  return useMutation({
    mutationFn: ajouterJourSpecial,
    onSuccess: () => invalidate(),
  });
};

export const useModifierJourSpecialMutation = () => {
  const invalidate = useInvalidatePlanningQuery();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      modifierJourSpecial(id, data),
    onSuccess: () => invalidate(),
  });
};

export const useSupprimerJourSpecialMutation = () => {
  const invalidate = useInvalidatePlanningQuery();
  return useMutation({
    mutationFn: supprimerJourSpecial,
    onSuccess: () => invalidate(),
  });
};
