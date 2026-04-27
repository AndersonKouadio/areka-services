import type { RendezVous } from '@prisma/client';
import {
  TypeIntervention,
  StatutRDV,
  SourceRDV,
} from '@prisma/client';

export type { RendezVous };
export { TypeIntervention, StatutRDV, SourceRDV };

export interface IRendezVousParams {
  page?: number;
  limit?: number;
  search?: string;
  statut?: StatutRDV;
  type?: TypeIntervention;
  source?: SourceRDV;
  dateDebut?: string; // ISO
  dateFin?: string; // ISO
  sortBy?: 'dateRDV' | 'createdAt' | 'statut';
  sortOrder?: 'asc' | 'desc';
}
