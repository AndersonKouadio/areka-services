'use client';

import { Calendar } from '@heroui/react';
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Loader2, Sun, Sunset } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreneauxDisponiblesQuery } from '../queries/creneaux-disponibles.query';
import type { CreateRendezVousDTO } from '../schemas/rendez-vous.schema';

interface GroupeProps {
  label: string;
  creneaux: string[];
  selected: string | undefined;
  onSelect: (c: string) => void;
}

function CreneauxGroupe({ label, creneaux, selected, onSelect }: GroupeProps) {
  const Icon = label === 'Matin' ? Sun : Sunset;
  return (
    <div>
      <p className="text-foreground/60 mb-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
        <Icon size={12} />
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {creneaux.map((c) => {
          const debut = c.split('-')[0];
          const isActive = selected === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onSelect(c)}
              className={cn(
                'inline-flex h-10 min-w-[68px] items-center justify-center rounded-lg border px-3 text-sm font-medium tabular-nums whitespace-nowrap transition',
                isActive
                  ? 'border-areka-orange bg-areka-orange text-white shadow-sm'
                  : 'border-border hover:border-areka-orange/60 hover:bg-areka-orange/5'
              )}
            >
              {debut}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Etape1DateCreneau() {
  const { setValue, watch } = useFormContext<CreateRendezVousDTO>();
  const [dateValue, setDateValue] = useState<DateValue | null>(null);
  const dateRDV = watch('dateRDV');
  const creneauSelectionne = watch('creneau');

  useEffect(() => {
    if (dateRDV) setDateValue(today(getLocalTimeZone()).set({
      year: dateRDV.getFullYear(),
      month: dateRDV.getMonth() + 1,
      day: dateRDV.getDate(),
    }));
  }, [dateRDV]);

  const dateJS = dateValue?.toDate(getLocalTimeZone()) ?? null;
  const { data, isLoading } = useCreneauxDisponiblesQuery(dateJS);

  const handleDateChange = (val: DateValue) => {
    setDateValue(val);
    setValue('dateRDV', val.toDate(getLocalTimeZone()), { shouldValidate: true });
    setValue('creneau', '', { shouldValidate: false });
  };

  const handleCreneauClick = (c: string) => {
    setValue('creneau', c, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Choisissez une date</h3>
        <p className="text-foreground/60 mt-1 text-sm">
          Les jours grisés ne sont pas disponibles.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="overflow-x-auto">
          <Calendar
            value={dateValue}
            onChange={handleDateChange}
            minValue={today(getLocalTimeZone())}
            aria-label="Date du rendez-vous"
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

        <div>
          <p className="text-sm font-medium">Créneaux disponibles</p>
          {!dateValue && (
            <p className="text-foreground/60 mt-3 text-sm">
              Sélectionnez une date pour voir les créneaux.
            </p>
          )}
          {dateValue && isLoading && (
            <div className="text-foreground/60 mt-3 flex items-center gap-2 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Chargement...
            </div>
          )}
          {dateValue && !isLoading && data && !data.ouvert && (
            <p className="text-areka-coral mt-3 text-sm">Fermé ce jour-là.</p>
          )}
          {dateValue && !isLoading && data?.ouvert && data.creneaux.length === 0 && (
            <p className="text-areka-coral mt-3 text-sm">
              Tous les créneaux sont déjà pris.
            </p>
          )}
          {dateValue && !isLoading && data?.ouvert && data.creneaux.length > 0 && (
            <div className="mt-4 space-y-4">
              {(() => {
                const matin = data.creneaux.filter(
                  (c) => parseInt(c.split('h')[0], 10) < 12
                );
                const apresMidi = data.creneaux.filter(
                  (c) => parseInt(c.split('h')[0], 10) >= 12
                );
                return (
                  <>
                    {matin.length > 0 && (
                      <CreneauxGroupe
                        label="Matin"
                        creneaux={matin}
                        selected={creneauSelectionne}
                        onSelect={handleCreneauClick}
                      />
                    )}
                    {apresMidi.length > 0 && (
                      <CreneauxGroupe
                        label="Après-midi"
                        creneaux={apresMidi}
                        selected={creneauSelectionne}
                        onSelect={handleCreneauClick}
                      />
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
