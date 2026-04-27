'use client';

import {
  Modal,
  Button,
  TextArea,
  Label,
  FieldError,
  Calendar,
} from '@heroui/react';
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import { CalendarClock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';

interface ContentProps {
  dateValue: DateValue | null;
  setDateValue: (v: DateValue | null) => void;
  creneau: string;
  setCreneau: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  error: string | null;
  creneauxData?: { creneaux: string[]; ouvert: boolean };
  isPending: boolean;
  onSubmit: () => void;
}

export function ProposerDateModalContent({
  dateValue,
  setDateValue,
  creneau,
  setCreneau,
  message,
  setMessage,
  error,
  creneauxData,
  isPending,
  onSubmit,
}: ContentProps) {
  return (
    <>
      <Modal.Header>
        <Modal.Heading>Proposer une autre date</Modal.Heading>
      </Modal.Header>
      <Modal.Body>
        <p className="text-foreground/70 -mt-2 mb-4 text-sm">
          Le client recevra cette nouvelle proposition par email + SMS.
        </p>
        <div className="grid gap-6 md:grid-cols-[auto_1fr]">
          <Calendar
            value={dateValue}
            onChange={(v) => {
              setDateValue(v);
              setCreneau('');
            }}
            minValue={today(getLocalTimeZone())}
            aria-label="Nouvelle date"
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
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>
                {(date) => <Calendar.Cell date={date} />}
              </Calendar.GridBody>
            </Calendar.Grid>
          </Calendar>

          <div className="space-y-3">
            <p className="text-sm font-medium">Créneaux disponibles</p>
            {!dateValue && (
              <p className="text-foreground/60 text-sm">
                Sélectionnez une date.
              </p>
            )}
            {dateValue && creneauxData && !creneauxData.ouvert && (
              <p className="text-areka-coral text-sm">Fermé ce jour-là.</p>
            )}
            {dateValue &&
              creneauxData?.ouvert &&
              creneauxData.creneaux.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {creneauxData.creneaux.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCreneau(c)}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm font-medium transition',
                        creneau === c
                          ? 'border-areka-orange bg-areka-orange text-white'
                          : 'border-border hover:border-areka-orange/60'
                      )}
                    >
                      {formaterCreneau(c)}
                    </button>
                  ))}
                </div>
              )}

            <div className="space-y-2 pt-2">
              <Label htmlFor="message-proposer">
                Message au client (optionnel)
              </Label>
              <TextArea
                id="message-proposer"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Désolé, je ne suis pas disponible ce jour-là..."
                className="min-h-20 w-full"
              />
            </div>
            {error && <FieldError>{error}</FieldError>}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button slot="close" variant="tertiary">
          Annuler
        </Button>
        <Button variant="primary" onPress={onSubmit} isDisabled={isPending}>
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              <CalendarClock size={16} />
              Proposer
            </>
          )}
        </Button>
      </Modal.Footer>
    </>
  );
}
