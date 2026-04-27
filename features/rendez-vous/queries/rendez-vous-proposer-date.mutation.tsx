'use client';

import { useMutation } from '@tanstack/react-query';
import { proposerAutreDateRendezVous } from '../actions/proposer-date.action';
import { useInvalidateRendezVousQuery } from './index.query';

export const useProposerAutreDateRendezVousMutation = () => {
  const invalidate = useInvalidateRendezVousQuery();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      proposerAutreDateRendezVous(id, data),
    onSuccess: () => invalidate(),
  });
};
