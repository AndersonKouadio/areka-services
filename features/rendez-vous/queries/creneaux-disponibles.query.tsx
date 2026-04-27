'use client';

import { useQuery } from '@tanstack/react-query';
import { obtenirCreneauxDisponibles } from '../actions/obtenir-creneaux-disponibles.action';
import { rendezVousKeyQuery } from './index.query';

/**
 * Hook public — renvoie les créneaux dispo pour une date.
 * Utilisé par le formulaire client de prise de RDV.
 */
export const useCreneauxDisponiblesQuery = (date: Date | null) =>
  useQuery({
    queryKey: rendezVousKeyQuery('creneaux', date?.toISOString() ?? null),
    queryFn: () => obtenirCreneauxDisponibles(date!),
    enabled: !!date,
    staleTime: 30 * 1000,
  });
