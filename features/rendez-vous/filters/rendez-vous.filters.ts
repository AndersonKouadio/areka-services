'use client';

import {
  parseAsString,
  parseAsInteger,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import {
  StatutRDV,
  TypeIntervention,
  SourceRDV,
} from '@prisma/client';

export const rendezVousFilters = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(''),
  statut: parseAsStringEnum<StatutRDV>(Object.values(StatutRDV)),
  type: parseAsStringEnum<TypeIntervention>(Object.values(TypeIntervention)),
  source: parseAsStringEnum<SourceRDV>(Object.values(SourceRDV)),
  dateDebut: parseAsString,
  dateFin: parseAsString,
  sortBy: parseAsString.withDefault('dateRDV'),
  sortOrder: parseAsStringEnum<'asc' | 'desc'>(['asc', 'desc']).withDefault(
    'desc'
  ),
};

export const useRendezVousFilters = () =>
  useQueryStates(rendezVousFilters, {
    history: 'push',
    shallow: false,
  });
