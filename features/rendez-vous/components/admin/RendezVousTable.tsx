'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useRendezVousListQuery } from '../../queries/rendez-vous-list.query';
import { useRendezVousFilters } from '../../filters/rendez-vous.filters';
import { ChipStatut, ChipType } from './ChipStatut';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import { cn } from '@/lib/utils';

export function RendezVousTable() {
  const [filters, setFilters] = useRendezVousFilters();
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
        <p className="text-foreground/70">Aucune demande trouvée.</p>
      </div>
    );
  }

  const { page, totalPages, total } = data.meta;
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="bg-card border-border/50 overflow-hidden rounded-xl border">
      {/* Mobile : cards stackées (< 640px) */}
      <ul className="divide-border/40 divide-y sm:hidden">
        {data.data.map((r) => (
          <li key={r.id}>
            <Link
              href={`/admin/rendez-vous/${r.id}`}
              className="hover:bg-muted/30 block px-4 py-3 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">
                    {r.clientPrenom} {r.clientNom}
                  </p>
                  <p className="text-foreground/60 text-xs truncate">
                    {r.clientEmail}
                  </p>
                  <p className="text-foreground/70 mt-1 text-xs">
                    {formatDate(r.dateRDV)} · {formaterCreneau(r.creneau)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <ChipStatut statut={r.statut} />
                  <ChipType type={r.type} />
                </div>
              </div>
              <p className="text-foreground/50 mt-2 font-mono text-[10px]">
                {r.reference}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop : table HTML (>= 640px) */}
      <table className="hidden w-full sm:table">
        <thead className="bg-muted/40 border-border/50 border-b">
          <tr className="text-foreground/60 text-left text-xs font-medium uppercase tracking-wider">
            <th scope="col" className="px-4 py-3">Référence</th>
            <th scope="col" className="px-4 py-3">Client</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">Créneau</th>
            <th scope="col" className="px-4 py-3">Statut</th>
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
              <td className="px-4 py-3">{formatDate(r.dateRDV)}</td>
              <td className="px-4 py-3">{formaterCreneau(r.creneau)}</td>
              <td className="px-4 py-3">
                <ChipStatut statut={r.statut} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-border/40 text-foreground/70 flex items-center justify-between gap-2 border-t px-4 py-3 text-xs">
        <span>
          {total} résultat{total > 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilters({ page: Math.max(1, page - 1) })}
            disabled={isFirst}
            aria-label="Page précédente"
            className={cn(
              'inline-flex size-8 items-center justify-center rounded-md border transition',
              isFirst
                ? 'border-border/40 text-foreground/30 cursor-not-allowed'
                : 'border-border/60 hover:border-areka-orange hover:text-areka-orange'
            )}
          >
            <ChevronLeft size={14} />
          </button>
          <span className="tabular-nums">
            Page {page} / {Math.max(1, totalPages)}
          </span>
          <button
            type="button"
            onClick={() => setFilters({ page: page + 1 })}
            disabled={isLast}
            aria-label="Page suivante"
            className={cn(
              'inline-flex size-8 items-center justify-center rounded-md border transition',
              isLast
                ? 'border-border/40 text-foreground/30 cursor-not-allowed'
                : 'border-border/60 hover:border-areka-orange hover:text-areka-orange'
            )}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
