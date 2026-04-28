import { cn } from '@/lib/utils';
import { LIBELLE_STATUT, LIBELLE_TYPE } from '../../utils/statut.utils';
import type { StatutRDV, TypeIntervention } from '@/features/rendez-vous/types/enums';

const STATUT_CLASSES: Record<StatutRDV, string> = {
  EN_ATTENTE: 'bg-areka-amber/15 text-areka-amber border-areka-amber/30',
  CONFIRME: 'bg-areka-green/15 text-areka-green border-areka-green/30',
  REFUSE: 'bg-areka-coral/15 text-areka-coral border-areka-coral/30',
  PROPOSE_AUTRE_DATE: 'bg-areka-orange/15 text-areka-orange border-areka-orange/30',
  TERMINE: 'bg-areka-navy/15 text-areka-navy border-areka-navy/30',
  ANNULE: 'bg-muted text-foreground/50 border-border',
};

const TYPE_CLASSES: Record<TypeIntervention, string> = {
  ENTRETIEN: 'bg-areka-navy/10 text-areka-navy',
  DEPANNAGE: 'bg-areka-orange/10 text-areka-orange',
  PANNE_URGENTE: 'bg-areka-raspberry/10 text-areka-raspberry',
};

export function ChipStatut({ statut }: { statut: StatutRDV }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STATUT_CLASSES[statut]
      )}
    >
      {LIBELLE_STATUT[statut]}
    </span>
  );
}

export function ChipType({ type }: { type: TypeIntervention }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        TYPE_CLASSES[type]
      )}
    >
      {LIBELLE_TYPE[type]}
    </span>
  );
}
