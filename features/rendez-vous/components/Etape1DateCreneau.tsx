'use client';

import { Calendar } from '@heroui/react';
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreneauxDisponiblesQuery } from '../queries/creneaux-disponibles.query';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { CreateRendezVousDTO } from '../schemas/rendez-vous.schema';

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
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {data.creneaux.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCreneauClick(c)}
                  className={cn(
                    'rounded-lg border px-3 py-2.5 text-sm font-medium min-h-11 transition',
                    creneauSelectionne === c
                      ? 'border-areka-orange bg-areka-orange text-white shadow-xs'
                      : 'border-border hover:border-areka-orange/60 hover:bg-areka-orange/5'
                  )}
                >
                  {formaterCreneau(c)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
