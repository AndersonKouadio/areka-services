'use client';

import { useMutation } from '@tanstack/react-query';
import { modifierPlanningJour } from '../actions/planning.actions';
import { useInvalidatePlanningQuery } from './index.query';

export const useModifierPlanningJourMutation = () => {
  const invalidate = useInvalidatePlanningQuery();
  return useMutation({
    mutationFn: modifierPlanningJour,
    onSuccess: () => invalidate(),
  });
};
