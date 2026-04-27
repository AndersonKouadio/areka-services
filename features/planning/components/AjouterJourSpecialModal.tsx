'use client';

import { useState } from 'react';
import {
  Modal,
  Button,
  Calendar,
  Switch,
  TextArea,
  Label,
  FieldError,
} from '@heroui/react';
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { CalendarPlus, Loader2 } from 'lucide-react';
import { CreneauInput } from './CreneauInput';
import { useAjouterJourSpecialMutation } from '../queries/jour-special-mutations';

interface Props {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
}

export function AjouterJourSpecialModal({ isOpen, onOpenChange }: Props) {
  const [date, setDate] = useState<DateValue | null>(null);
  const [actif, setActif] = useState(false);
  const [creneaux, setCreneaux] = useState<string[]>([]);
  const [motif, setMotif] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useAjouterJourSpecialMutation();

  const reset = () => {
    setDate(null);
    setActif(false);
    setCreneaux([]);
    setMotif('');
    setError(null);
  };

  const submit = async () => {
    setError(null);
    if (!date) {
      setError('Sélectionnez une date.');
      return;
    }
    const result = await mutateAsync({
      date: date.toDate(getLocalTimeZone()),
      actif,
      creneaux,
      motif: motif || undefined,
    });
    if (result.success) {
      reset();
      onOpenChange(false);
    } else {
      setError(result.error ?? 'Erreur inattendue');
    }
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="max-w-xl">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Ajouter un jour spécial</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="space-y-4">
            <p className="text-foreground/70 -mt-2 mb-4 text-sm">
              Vacances, jour férié ou ouverture exceptionnelle.
            </p>
            <div className="flex justify-center">
              <Calendar
                value={date}
                onChange={setDate}
                minValue={today(getLocalTimeZone())}
                aria-label="Date du jour spécial"
              >
                <Calendar.Header>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.YearPickerTrigger>
                    <Calendar.YearPickerTriggerHeading />
                  </Calendar.YearPickerTrigger>
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(d) => <Calendar.HeaderCell>{d}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {(d) => <Calendar.Cell date={d} />}
                  </Calendar.GridBody>
                </Calendar.Grid>
              </Calendar>
            </div>

            <div className="bg-muted/30 flex items-center justify-between rounded-lg p-3">
              <div>
                <p className="text-sm font-medium">Jour ouvert</p>
                <p className="text-foreground/60 text-xs">
                  Décocher pour fermer ce jour-là.
                </p>
              </div>
              <Switch isSelected={actif} onChange={setActif}>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
            </div>

            {actif && (
              <div className="space-y-2">
                <Label>Créneaux disponibles ce jour-là</Label>
                <CreneauInput creneaux={creneaux} onChange={setCreneaux} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="motif">Motif (optionnel)</Label>
              <TextArea
                id="motif"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Vacances, jour férié, formation..."
                className="min-h-16 w-full"
              />
            </div>

            {error && <FieldError>{error}</FieldError>}
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
                  <Loader2 size={16} className="animate-spin" /> Ajout...
                </>
              ) : (
                <>
                  <CalendarPlus size={16} /> Ajouter
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
