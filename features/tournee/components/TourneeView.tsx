'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@heroui/react';
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import { Loader2, MapPin, Clock, Phone, AlertTriangle } from 'lucide-react';
import { calculerTourneeJour } from '../actions/calculer-tournee.action';
import { ChipType } from '@/features/rendez-vous/components/admin/ChipStatut';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { TourneeJour } from '../types/tournee.type';

export function TourneeView() {
  const [dateValue, setDateValue] = useState<DateValue | null>(
    today(getLocalTimeZone())
  );
  const [tournee, setTournee] = useState<TourneeJour | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch quand la date change
  useEffect(() => {
    if (!dateValue) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    calculerTourneeJour(dateValue.toDate(getLocalTimeZone()))
      .then((result) => {
        if (!cancelled) setTournee(result);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? 'Erreur de chargement');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dateValue]);

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div>
        <Calendar
          value={dateValue}
          onChange={setDateValue}
          aria-label="Date de la tournée"
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

      <div>
        {loading && (
          <div className="text-foreground/60 flex items-center justify-center gap-2 py-12 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Calcul de la tournée...
          </div>
        )}
        {error && !loading && (
          <p className="text-areka-coral bg-areka-coral/10 rounded-lg p-3 text-sm">
            {error}
          </p>
        )}
        {!loading && !error && tournee && <TourneeResultats tournee={tournee} />}
      </div>
    </div>
  );
}

function TourneeResultats({ tournee }: { tournee: TourneeJour }) {
  const totalRdvs = tournee.rdvs.length + tournee.rdvsSansCoords.length;

  if (totalRdvs === 0) {
    return (
      <p className="text-foreground/60 py-12 text-center text-sm">
        Aucun rendez-vous ce jour-là.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border-border/50 flex items-center justify-between rounded-xl border p-4">
        <p className="text-sm">
          <strong>{totalRdvs}</strong> rendez-vous
          {totalRdvs > 1 ? 's' : ''}
        </p>
        {tournee.rdvs.length > 0 && (
          <p className="text-foreground/60 text-xs">
            ≈ <strong>{Math.round(tournee.distanceTotale)} km</strong> au total
          </p>
        )}
      </div>

      {tournee.rdvsSansCoords.length > 0 && (
        <div className="bg-areka-amber/10 border-areka-amber/40 rounded-xl border p-4 text-sm">
          <p className="text-areka-amber inline-flex items-center gap-2 font-semibold">
            <AlertTriangle size={16} />
            {tournee.rdvsSansCoords.length} adresse(s) non géocodée(s)
          </p>
          <p className="text-foreground/70 mt-1 text-xs">
            Vérifiez ces adresses manuellement (clé OpenRouteService manquante
            ou adresse hors France) :
          </p>
          <ul className="mt-3 space-y-2">
            {tournee.rdvsSansCoords.map((r) => (
              <li
                key={r.id}
                className="bg-card border-border/50 rounded-lg border p-3"
              >
                <p className="font-medium">
                  {r.clientPrenom} {r.clientNom}{' '}
                  <ChipType type={r.type} />
                </p>
                <p className="text-foreground/70 mt-1 inline-flex items-center gap-1.5 text-xs">
                  <Clock size={12} /> {formaterCreneau(r.creneau)}
                </p>
                <p className="text-foreground/70 mt-0.5 inline-flex items-start gap-1.5 text-xs">
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  {r.clientAdresse}
                </p>
                <p className="text-foreground/70 mt-0.5 inline-flex items-center gap-1.5 text-xs">
                  <Phone size={12} />
                  <a
                    href={`tel:${r.clientTelephone}`}
                    className="hover:text-areka-orange"
                  >
                    {r.clientTelephone}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tournee.rdvs.length > 0 && (
        <ol className="space-y-2">
          {tournee.rdvs.map((r) => (
            <li
              key={r.rdv.id}
              className="bg-card border-border/50 flex items-start gap-4 rounded-xl border p-4"
            >
              <div className="bg-areka-navy/10 text-areka-navy flex size-10 shrink-0 items-center justify-center rounded-lg font-bold">
                {r.ordre + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">
                    {r.rdv.clientPrenom} {r.rdv.clientNom}
                  </p>
                  <ChipType type={r.rdv.type} />
                </div>
                <p className="text-foreground/70 mt-1 inline-flex items-center gap-1.5 text-xs">
                  <Clock size={12} /> {formaterCreneau(r.rdv.creneau)}
                </p>
                <p className="text-foreground/70 mt-0.5 inline-flex items-start gap-1.5 text-xs">
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  {r.rdv.clientAdresse}
                </p>
              </div>
              {r.distanceDepuisPrecedent > 0 && (
                <span className="text-areka-orange shrink-0 text-xs font-medium">
                  +{Math.round(r.distanceDepuisPrecedent)} km
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
