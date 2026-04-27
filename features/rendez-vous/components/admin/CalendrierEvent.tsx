import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TypeIntervention, StatutRDV } from '@prisma/client';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { RendezVous } from '@prisma/client';

interface Props {
  rdv: RendezVous;
}

const TYPE_BG: Record<TypeIntervention, string> = {
  ENTRETIEN: 'bg-areka-navy/15 text-areka-navy hover:bg-areka-navy/25 border-areka-navy/30',
  DEPANNAGE: 'bg-areka-orange/15 text-areka-orange hover:bg-areka-orange/25 border-areka-orange/30',
  PANNE_URGENTE:
    'bg-areka-raspberry/15 text-areka-raspberry hover:bg-areka-raspberry/25 border-areka-raspberry/30',
};

const STATUT_OPACITY: Record<StatutRDV, string> = {
  EN_ATTENTE: 'opacity-60 border-dashed',
  CONFIRME: '',
  REFUSE: 'opacity-30 line-through',
  PROPOSE_AUTRE_DATE: 'opacity-70',
  TERMINE: 'opacity-50',
  ANNULE: 'opacity-30 line-through',
};

export function CalendrierEvent({ rdv }: Props) {
  const heureDebut = rdv.creneau.split('-')[0];
  return (
    <Link
      href={`/admin/rendez-vous/${rdv.id}`}
      className={cn(
        'block truncate rounded border px-1.5 py-0.5 text-[10px] font-medium transition',
        TYPE_BG[rdv.type],
        STATUT_OPACITY[rdv.statut]
      )}
      title={`${heureDebut} — ${rdv.clientPrenom} ${rdv.clientNom} (${formaterCreneau(rdv.creneau)})`}
    >
      <span className="font-mono">{heureDebut}</span>{' '}
      {rdv.clientPrenom} {rdv.clientNom.charAt(0)}.
    </Link>
  );
}
