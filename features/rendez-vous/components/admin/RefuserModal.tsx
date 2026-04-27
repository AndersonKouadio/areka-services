'use client';

import { useState } from 'react';
import { Modal, Button, TextArea, Label, FieldError } from '@heroui/react';
import { X, Loader2 } from 'lucide-react';
import { useRefuserRendezVousMutation } from '../../queries/rendez-vous-refuser.mutation';

interface Props {
  rdvId: string;
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
}

export function RefuserModal({ rdvId, isOpen, onOpenChange }: Props) {
  const [motif, setMotif] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useRefuserRendezVousMutation();

  const submit = async () => {
    setError(null);
    if (motif.trim().length < 5) {
      setError('Le motif doit contenir au moins 5 caractères.');
      return;
    }
    const result = await mutateAsync({
      id: rdvId,
      data: { motifRefus: motif },
    });
    if (result.success) {
      setMotif('');
      onOpenChange(false);
    } else {
      setError(result.error ?? 'Erreur inattendue');
    }
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Refuser la demande</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p className="text-foreground/70 -mt-2 mb-4 text-sm">
              Le client recevra le motif par email + SMS.
            </p>
            <div className="space-y-2">
              <Label htmlFor="motif-refus">Motif du refus *</Label>
              <TextArea
                id="motif-refus"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Ex : Indisponible ce jour-là, je vous contacte pour proposer une autre date."
                className="min-h-24 w-full"
              />
              {error && <FieldError>{error}</FieldError>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="tertiary">
              Annuler
            </Button>
            <Button
              variant="danger"
              onPress={submit}
              isDisabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Refus...
                </>
              ) : (
                <>
                  <X size={16} />
                  Refuser
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
