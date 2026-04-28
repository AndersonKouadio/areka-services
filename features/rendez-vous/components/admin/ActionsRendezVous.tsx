'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Check, X, CalendarClock } from 'lucide-react';
import { ValiderModal } from './ValiderModal';
import { RefuserModal } from './RefuserModal';
import { ProposerDateModal } from './ProposerDateModal';
import type { StatutRDV } from '@/features/rendez-vous/types/enums';

interface Props {
  rdvId: string;
  statut: StatutRDV;
}

export function ActionsRendezVous({ rdvId, statut }: Props) {
  const [validerOpen, setValiderOpen] = useState(false);
  const [refuserOpen, setRefuserOpen] = useState(false);
  const [proposerOpen, setProposerOpen] = useState(false);

  const isFinalState =
    statut === 'CONFIRME' ||
    statut === 'REFUSE' ||
    statut === 'TERMINE' ||
    statut === 'ANNULE';

  if (isFinalState) {
    return (
      <div className="bg-muted/30 border-border/40 rounded-xl border p-4 text-sm">
        <p className="text-foreground/60">
          Cette demande est dans un état final.{' '}
          {statut === 'CONFIRME' &&
            'Le RDV est confirmé — il pourra être marqué comme terminé après l\'intervention.'}
          {statut === 'REFUSE' && 'Demande refusée.'}
          {statut === 'TERMINE' && 'Intervention terminée.'}
          {statut === 'ANNULE' && 'Demande annulée.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onPress={() => setValiderOpen(true)}>
          <Check size={16} />
          Valider
        </Button>
        <Button variant="outline" onPress={() => setProposerOpen(true)}>
          <CalendarClock size={16} />
          Proposer une autre date
        </Button>
        <Button variant="danger-soft" onPress={() => setRefuserOpen(true)}>
          <X size={16} />
          Refuser
        </Button>
      </div>

      <ValiderModal
        rdvId={rdvId}
        isOpen={validerOpen}
        onOpenChange={setValiderOpen}
      />
      <RefuserModal
        rdvId={rdvId}
        isOpen={refuserOpen}
        onOpenChange={setRefuserOpen}
      />
      <ProposerDateModal
        rdvId={rdvId}
        isOpen={proposerOpen}
        onOpenChange={setProposerOpen}
      />
    </>
  );
}
