'use client';

import { useQuery } from '@tanstack/react-query';
import { rendezVousAPI } from '../apis/rendez-vous.api';
import { rendezVousKeyQuery } from './index.query';

/**
 * Hook public — renvoie les créneaux dispo pour une date.
 * Utilisé par le formulaire client de prise de RDV.
 *
 * Passe par GET /api/creneaux-disponibles (cacheable côté HTTP).
 */
export const useCreneauxDisponiblesQuery = (date: Date | null) =>
  useQuery({
    queryKey: rendezVousKeyQuery('creneaux', date?.toISOString() ?? null),
    queryFn: () => rendezVousAPI.obtenirCreneauxDisponibles(date!),
    enabled: !!date,
    staleTime: 30 * 1000,
  });
