import { useQueryClient } from '@tanstack/react-query';

export const planningKeyQuery = (...params: unknown[]) => ['planning', ...params];

export const useInvalidatePlanningQuery = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['planning'] });
};
