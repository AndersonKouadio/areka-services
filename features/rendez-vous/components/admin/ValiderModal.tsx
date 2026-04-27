'use client';

import { useState } from 'react';
import { Modal, Button, TextArea, Label, FieldError } from '@heroui/react';
import { Check, Loader2 } from 'lucide-react';
import { useValiderRendezVousMutation } from '../../queries/rendez-vous-valider.mutation';

interface Props {
  rdvId: string;
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ValiderModal({ rdvId, isOpen, onOpenChange }: Props) {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useValiderRendezVousMutation();

  const submit = async () => {
    setError(null);
    const result = await mutateAsync({
      id: rdvId,
      data: { notesAdmin: notes || undefined },
    });
    if (result.success) {
      setNotes('');
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
            <Modal.Heading>Valider la demande</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p className="text-foreground/70 -mt-2 mb-4 text-sm">
              Le client recevra un email + SMS de confirmation.
            </p>
            <div className="space-y-2">
              <Label htmlFor="notes-valider">Note interne (optionnel)</Label>
              <TextArea
                id="notes-valider"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Préparation, matériel à apporter..."
                className="min-h-20 w-full"
              />
              {error && <FieldError>{error}</FieldError>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="tertiary">
              Annuler
            </Button>
            <Button
              variant="primary"
              onPress={submit}
              isDisabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Validation...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Confirmer
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
