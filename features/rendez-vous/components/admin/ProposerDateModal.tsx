'use client';

import { useState } from 'react';
import { Modal } from '@heroui/react';
import {
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date';
import { useProposerAutreDateRendezVousMutation } from '../../queries/rendez-vous-proposer-date.mutation';
import { useCreneauxDisponiblesQuery } from '../../queries/creneaux-disponibles.query';
import { ProposerDateModalContent } from './ProposerDateModalContent';

interface Props {
  rdvId: string;
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ProposerDateModal({ rdvId, isOpen, onOpenChange }: Props) {
  const [dateValue, setDateValue] = useState<DateValue | null>(null);
  const [creneau, setCreneau] = useState<string>('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dateJS = dateValue?.toDate(getLocalTimeZone()) ?? null;
  const { data: creneauxData } = useCreneauxDisponiblesQuery(dateJS);
  const { mutateAsync, isPending } = useProposerAutreDateRendezVousMutation();

  const submit = async () => {
    setError(null);
    if (!dateJS || !creneau) {
      setError('Sélectionnez une date et un créneau.');
      return;
    }
    const result = await mutateAsync({
      id: rdvId,
      data: { datePropose: dateJS, creneauPropose: creneau, message },
    });
    if (result.success) {
      setDateValue(null);
      setCreneau('');
      setMessage('');
      onOpenChange(false);
    } else {
      setError(result.error ?? 'Erreur inattendue');
    }
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="max-w-2xl">
          <Modal.CloseTrigger />
          <ProposerDateModalContent
            dateValue={dateValue}
            setDateValue={setDateValue}
            creneau={creneau}
            setCreneau={setCreneau}
            message={message}
            setMessage={setMessage}
            error={error}
            creneauxData={creneauxData}
            isPending={isPending}
            onSubmit={submit}
          />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
