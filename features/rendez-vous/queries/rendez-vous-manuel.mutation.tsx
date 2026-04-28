'use client';

import { useMutation } from '@tanstack/react-query';
import { ajouterRendezVousManuel } from '../actions/rendez-vous.actions';
import { useInvalidateRendezVousQuery } from './index.query';

/**
 * Mutation admin — création manuelle d'un RDV (pris au téléphone).
 * Le RDV est créé directement avec statut CONFIRME et source MANUEL.
 */
export const useAjouterRendezVousManuelMutation = () => {
  const invalidate = useInvalidateRendezVousQuery();
  return useMutation({
    mutationFn: ajouterRendezVousManuel,
    onSuccess: () => {
      invalidate();
    },
  });
};
