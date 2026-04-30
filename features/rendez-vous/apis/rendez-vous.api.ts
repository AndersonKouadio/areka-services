'use client';

import { apiClient } from '@/lib/api-client';
import type { AutocompleteResult } from '../actions/autocomplete-adresse.action';
import type { ChartsData } from '../actions/charts.action';
import type { StatsRendezVous } from '../actions/stats.action';
import type { IRendezVousParams } from '../types/rendez-vous.type';
import type { PaginatedResponse } from '@/types/api.type';
import type { RendezVous } from '@prisma/client';

/**
 * Couche HTTP côté client pour les reads RDV.
 * Appelée par les TanStack Query hooks (queries/).
 *
 * Convention ak-starters frontend : pas de logique métier ici, juste
 * du wrap fetch typé. Les Route Handlers /api/rendez-vous/... font
 * l'orchestration serveur (auth + Prisma).
 */

export const rendezVousAPI = {
  obtenirCreneauxDisponibles: (date: Date) =>
    apiClient.get<{ creneaux: string[]; ouvert: boolean }>(
      '/api/creneaux-disponibles',
      { params: { date: date.toISOString() } },
    ),

  autocompleteAdresse: (query: string) =>
    apiClient.get<AutocompleteResult>('/api/geocode/autocomplete', {
      params: { q: query },
    }),

  obtenirTous: (params?: IRendezVousParams) =>
    apiClient.get<PaginatedResponse<RendezVous>>('/api/rendez-vous', {
      params: params as Record<string, string | number | undefined>,
    }),

  obtenirParId: (id: string) =>
    apiClient.get<RendezVous>(`/api/rendez-vous/${id}`),

  obtenirStats: () =>
    apiClient.get<StatsRendezVous>('/api/rendez-vous/stats'),

  obtenirCharts: () =>
    apiClient.get<ChartsData>('/api/rendez-vous/charts'),
};
