import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ChipStatut, ChipType } from './ChipStatut';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { RendezVous } from '@prisma/client';

interface RendezVousRecentsProps {
  rendezVous: RendezVous[];
}

export function RendezVousRecents({ rendezVous }: RendezVousRecentsProps) {
  return (
    <div className="bg-card border-border/50 overflow-hidden rounded-xl border">
      <div className="border-border/50 flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-lg font-semibold">Demandes récentes</h2>
        <Link
          href="/admin/rendez-vous"
          className="text-areka-orange hover:text-areka-orange/80 inline-flex items-center gap-1 text-sm font-medium transition"
        >
          Voir tout
          <ArrowRight size={14} />
        </Link>
      </div>
      {rendezVous.length === 0 ? (
        <p className="text-foreground/50 px-5 py-8 text-center text-sm">
          Aucune demande pour l&apos;instant.
        </p>
      ) : (
        <ul className="divide-border/40 divide-y">
          {rendezVous.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/rendez-vous/${r.id}`}
                className="hover:bg-muted/50 flex items-center gap-4 px-5 py-3 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {r.clientPrenom} {r.clientNom}
                  </p>
                  <p className="text-foreground/60 mt-0.5 truncate text-xs">
                    {r.reference} ·{' '}
                    {new Date(r.dateRDV).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}{' '}
                    · {formaterCreneau(r.creneau)}
                  </p>
                </div>
                <ChipType type={r.type} />
                <ChipStatut statut={r.statut} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
