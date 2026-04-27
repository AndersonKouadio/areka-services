import { useQueryClient } from '@tanstack/react-query';

export const rendezVousKeyQuery = (...params: unknown[]) => [
  'rendez-vous',
  ...params,
];

export const useInvalidateRendezVousQuery = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: ['rendez-vous'] });
};
