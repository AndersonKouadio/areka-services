'use client';

import { Calendar } from '@heroui/react';
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { useFormContext } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { Loader2, Sun, Sunset, CalendarDays, Check } from 'lucide-react';
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
  const iconColor = label === 'Matin' ? 'text-areka-amber' : 'text-areka-orange';
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            'inline-flex size-6 items-center justify-center rounded-full',
            label === 'Matin' ? 'bg-areka-amber/15' : 'bg-areka-orange/15'
          )}
        >
          <Icon size={13} className={iconColor} />
        </span>
        <p className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">
          {label}
        </p>
        <span className="text-foreground/50 text-xs">
          · {creneaux.length} dispo{creneaux.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {creneaux.map((c) => {
          const [debut, fin] = c.split('-');
          const isActive = selected === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onSelect(c)}
              aria-pressed={isActive}
              aria-label={`Créneau de ${debut} à ${fin}`}
              className={cn(
                'group relative flex h-12 min-w-[110px] flex-1 basis-[120px] items-center justify-center rounded-xl border-2 px-3 transition-all duration-150',
                isActive
                  ? 'border-accent bg-accent text-accent-foreground shadow-md'
                  : 'border-border bg-surface text-foreground hover:border-accent/50 hover:bg-accent/10 hover:shadow-sm active:scale-[0.98]'
              )}
            >
              <span className="flex items-baseline gap-1 tabular-nums">
                <span className="text-sm font-semibold">{debut}</span>
                <span
                  className={cn(
                    'text-xs',
                    isActive ? 'text-accent-foreground/60' : 'text-foreground/40'
                  )}
                  aria-hidden="true"
                >
                  —
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isActive ? 'text-accent-foreground' : 'text-foreground'
                  )}
                >
                  {fin}
                </span>
              </span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="bg-accent-foreground/15 absolute right-2 top-1/2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-full"
                >
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
                Réessayez dans un instant ou appelez-nous au 07 69 40 10 93.
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
            <div className="mt-4 space-y-5">
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
