'use client';

import { Calendar } from '@heroui/react';
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { useFormContext } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { Loader2, CalendarDays } from 'lucide-react';
import { useCreneauxDisponiblesQuery } from '../queries/creneaux-disponibles.query';
import { CreneauxSection } from './CreneauxPicker';
import type { CreateRendezVousDTO } from '../schemas/rendez-vous.schema';

export function Etape1DateCreneau() {
  const { setValue, watch } = useFormContext<CreateRendezVousDTO>();
  // état local — uniquement pour piloter le composant Calendar
  // (sa source de vérité reste `dateRDV` côté form).
  const [localDate, setLocalDate] = useState<DateValue | null>(null);
  const dateRDV = watch('dateRDV');
  const creneauSelectionne = watch('creneau');

  // dateValue dérivé : si le form a une dateRDV, on la convertit en DateValue ;
  // sinon on retombe sur l'état local (post-clic utilisateur avant validate).
  const dateValue = useMemo<DateValue | null>(() => {
    if (dateRDV) {
      return today(getLocalTimeZone()).set({
        year: dateRDV.getFullYear(),
        month: dateRDV.getMonth() + 1,
        day: dateRDV.getDate(),
      });
    }
    return localDate;
  }, [dateRDV, localDate]);

  const dateJS = dateValue?.toDate(getLocalTimeZone()) ?? null;
  const { data, isLoading, isError } = useCreneauxDisponiblesQuery(dateJS);

  const handleDateChange = (val: DateValue) => {
    setLocalDate(val);
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

      <div className="grid gap-6 lg:grid-cols-[minmax(320px,1fr)_1fr] lg:items-start lg:gap-8">
        <div className="bg-surface/60 border-border/50 w-full rounded-2xl border p-4 sm:p-6">
          <Calendar
            value={dateValue}
            onChange={handleDateChange}
            minValue={today(getLocalTimeZone())}
            aria-label="Date du rendez-vous"
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

        <div className="min-h-[280px]">
          <p className="text-sm font-semibold">Créneaux disponibles</p>
          {!dateValue && (
            <div className="border-border/50 bg-muted/30 mt-3 flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center">
              <CalendarDays size={28} className="text-foreground/40 mb-2" />
              <p className="text-foreground/60 text-sm">
                Sélectionnez une date pour voir les créneaux.
              </p>
            </div>
          )}
          {dateValue && isLoading && (
            <div className="text-foreground/60 mt-3 flex min-h-[200px] items-center justify-center gap-2 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Chargement des créneaux...
            </div>
          )}
          {dateValue && !isLoading && isError && (
            <div className="border-areka-coral/30 bg-areka-coral/5 mt-3 rounded-2xl border p-4 text-sm">
              <p className="text-areka-coral font-medium">Service temporairement indisponible.</p>
              <p className="text-foreground/60 mt-1 text-xs">
                Réessayez dans un instant ou appelez-nous au +33 7 69 40 10 93.
              </p>
            </div>
          )}
          {dateValue && !isLoading && !isError && data && !data.ouvert && (
            <div className="border-areka-coral/30 bg-areka-coral/5 mt-3 rounded-2xl border p-4 text-sm">
              <p className="text-areka-coral font-medium">Fermé ce jour-là.</p>
              <p className="text-foreground/60 mt-1 text-xs">
                Sélectionnez un autre jour dans le calendrier.
              </p>
            </div>
          )}
          {dateValue && !isLoading && !isError && data?.ouvert && data.creneaux.length === 0 && (
            <div className="border-areka-coral/30 bg-areka-coral/5 mt-3 rounded-2xl border p-4 text-sm">
              <p className="text-areka-coral font-medium">Tous les créneaux sont déjà pris.</p>
              <p className="text-foreground/60 mt-1 text-xs">
                Essayez un autre jour pour voir nos disponibilités.
              </p>
            </div>
          )}
          {dateValue && !isLoading && !isError && data?.ouvert && data.creneaux.length > 0 && (
            <div className="mt-4">
              <CreneauxSection
                matin={data.creneaux.filter(
                  (c) => parseInt(c.split('h')[0], 10) < 12
                )}
                apresMidi={data.creneaux.filter(
                  (c) => parseInt(c.split('h')[0], 10) >= 12
                )}
                selected={creneauSelectionne}
                onSelect={handleCreneauClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
