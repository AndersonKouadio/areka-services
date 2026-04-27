'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useRendezVousListQuery } from '../../queries/rendez-vous-list.query';
import { useRendezVousFilters } from '../../filters/rendez-vous.filters';
import { ChipStatut, ChipType } from './ChipStatut';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';

export function RendezVousTable() {
  const [filters] = useRendezVousFilters();
  const { data, isLoading } = useRendezVousListQuery({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    statut: filters.statut ?? undefined,
    type: filters.type ?? undefined,
    sortBy: filters.sortBy as 'dateRDV' | 'createdAt' | 'statut',
    sortOrder: filters.sortOrder,
  });

  if (isLoading) {
    return (
      <div className="text-foreground/60 flex items-center justify-center gap-2 py-16">
        <Loader2 size={16} className="animate-spin" />
        Chargement...
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="bg-card border-border/50 rounded-xl border py-16 text-center">
        <p className="text-foreground/50">Aucune demande trouvée.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border-border/50 overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead className="bg-muted/40 border-border/50 border-b">
          <tr className="text-foreground/60 text-left text-xs font-medium uppercase tracking-wider">
            <th className="px-4 py-3">Référence</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Créneau</th>
            <th className="px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-border/40 divide-y text-sm">
          {data.data.map((r) => (
            <tr key={r.id} className="hover:bg-muted/30 transition">
              <td className="px-4 py-3 font-mono text-xs">
                <Link
                  href={`/admin/rendez-vous/${r.id}`}
                  className="hover:text-areka-orange transition"
                >
                  {r.reference}
                </Link>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">
                  {r.clientPrenom} {r.clientNom}
                </p>
                <p className="text-foreground/60 text-xs">{r.clientEmail}</p>
              </td>
              <td className="px-4 py-3">
                <ChipType type={r.type} />
              </td>
              <td className="px-4 py-3">
                {new Date(r.dateRDV).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="px-4 py-3">{formaterCreneau(r.creneau)}</td>
              <td className="px-4 py-3">
                <ChipStatut statut={r.statut} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-border/40 text-foreground/60 flex items-center justify-between border-t px-4 py-3 text-xs">
        <span>
          {data.meta.total} résultat{data.meta.total > 1 ? 's' : ''}
        </span>
        <span>
          Page {data.meta.page}/{data.meta.totalPages}
        </span>
      </div>
    </div>
  );
}
