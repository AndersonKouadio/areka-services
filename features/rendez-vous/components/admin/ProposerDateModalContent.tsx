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
import { CalendarClock, CalendarDays, Loader2, X } from 'lucide-react';
import { CreneauxSection } from '../CreneauxPicker';

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
  const matin =
    creneauxData?.creneaux.filter(
      (c) => parseInt(c.split('h')[0], 10) < 12
    ) ?? [];
  const apresMidi =
    creneauxData?.creneaux.filter(
      (c) => parseInt(c.split('h')[0], 10) >= 12
    ) ?? [];

  return (
    <>
      <Modal.Header>
        <Modal.Heading className="flex items-center gap-2">
          <span className="bg-accent/15 text-accent inline-flex size-9 items-center justify-center rounded-full">
            <CalendarClock size={18} />
          </span>
          Proposer une autre date
        </Modal.Heading>
        <p className="text-foreground/70 mt-2 text-sm">
          Le client recevra cette nouvelle proposition par email + SMS.
        </p>
      </Modal.Header>
      <Modal.Body className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-start">
          {/* Calendrier */}
          <div className="bg-surface/60 border-border/50 w-full rounded-2xl border p-3 sm:p-4">
            <Calendar
              value={dateValue}
              onChange={(v) => {
                setDateValue(v);
                setCreneau('');
              }}
              minValue={today(getLocalTimeZone())}
              aria-label="Nouvelle date"
              className="!w-full !max-w-none"
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
          </div>

          {/* Créneaux + message */}
          <div className="space-y-4">
            <p className="text-sm font-semibold">Créneaux disponibles</p>

            {!dateValue && (
              <div className="border-border/50 bg-muted/30 flex min-h-[140px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center">
                <CalendarDays size={24} className="text-foreground/40 mb-2" />
                <p className="text-foreground/60 text-sm">
                  Sélectionnez une date pour voir les créneaux.
                </p>
              </div>
            )}

            {dateValue && creneauxData && !creneauxData.ouvert && (
              <div className="border-areka-coral/30 bg-areka-coral/5 rounded-2xl border p-4 text-sm">
                <p className="text-areka-coral font-medium">Fermé ce jour-là.</p>
                <p className="text-foreground/60 mt-1 text-xs">
                  Sélectionnez un autre jour.
                </p>
              </div>
            )}

            {dateValue &&
              creneauxData?.ouvert &&
              creneauxData.creneaux.length === 0 && (
                <div className="border-areka-coral/30 bg-areka-coral/5 rounded-2xl border p-4 text-sm">
                  <p className="text-areka-coral font-medium">
                    Tous les créneaux sont déjà pris.
                  </p>
                </div>
              )}

            {dateValue &&
              creneauxData?.ouvert &&
              creneauxData.creneaux.length > 0 && (
                <CreneauxSection
                  matin={matin}
                  apresMidi={apresMidi}
                  selected={creneau}
                  onSelect={setCreneau}
                />
              )}

            <div className="border-border/40 space-y-2 border-t pt-4">
              <Label htmlFor="message-proposer">
                Message au client (optionnel)
              </Label>
              <TextArea
                id="message-proposer"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Désolé, je ne suis pas disponible ce jour-là…"
                className="min-h-20 w-full"
              />
            </div>

            {error && (
              <FieldError className="block">
                {error}
              </FieldError>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button slot="close" variant="tertiary">
          <X size={14} />
          Annuler
        </Button>
        <Button variant="primary" onPress={onSubmit} isDisabled={isPending}>
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Envoi…
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
