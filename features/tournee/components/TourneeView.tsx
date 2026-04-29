'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Calendar } from '@heroui/react';
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import { Loader2, MapPin, Clock, Phone, AlertTriangle, Navigation, Mail } from 'lucide-react';
import { calculerTourneeJour } from '../actions/calculer-tournee.action';
import { ChipType } from '@/features/rendez-vous/components/admin/ChipStatut';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { TourneeJour } from '../types/tournee.type';

// Leaflet exige `window` — on désactive le SSR pour ce composant.
const TourneeMap = dynamic(() => import('./TourneeMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted/30 border-border/50 text-foreground/50 flex h-[400px] items-center justify-center rounded-xl border text-sm">
      <Loader2 size={16} className="mr-2 animate-spin" /> Chargement de la carte...
    </div>
  ),
});

export function TourneeView() {
  const [dateValue, setDateValue] = useState<DateValue | null>(
    today(getLocalTimeZone())
  );

  const dateJS = dateValue?.toDate(getLocalTimeZone()) ?? null;
  const dateKey = dateJS?.toISOString() ?? null;

  const { data: tournee, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['tournee', dateKey],
    queryFn: () => calculerTourneeJour(dateJS!),
    enabled: !!dateJS,
    staleTime: 30 * 1000,
  });
  const error =
    queryError instanceof Error ? queryError.message : queryError ? 'Erreur de chargement' : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div className="w-full lg:w-auto">
        <Calendar
          value={dateValue}
          onChange={setDateValue}
          aria-label="Date de la tournée"
          className="w-full lg:w-auto"
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
              {(d) => (
                <Calendar.HeaderCell className="text-foreground/70 text-xs font-semibold uppercase">
                  {d}
                </Calendar.HeaderCell>
              )}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(d) => <Calendar.Cell date={d} />}
            </Calendar.GridBody>
          </Calendar.Grid>
        </Calendar>
      </div>

      <div className="min-w-0">
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
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.clientAdresse)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-areka-orange mt-0.5 flex items-start gap-1.5 text-xs transition"
                >
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  <span className="break-words">{r.clientAdresse}</span>
                </a>
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

      {tournee.rdvs.length > 0 && <TourneeMap tournee={tournee} />}

      {tournee.rdvs.length > 0 && <SyntheseParZone tournee={tournee} />}

      {tournee.rdvs.length > 0 && (
        <ol className="space-y-2">
          {tournee.rdvs.map((r) => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.rdv.clientAdresse)}`;
            return (
              <li
                key={r.rdv.id}
                className="bg-card border-border/50 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:gap-4"
              >
                <div className="flex items-start gap-3 sm:contents">
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
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/70 hover:text-areka-orange mt-0.5 flex items-start gap-1.5 text-xs transition"
                      title="Ouvrir dans Google Maps"
                    >
                      <MapPin size={12} className="mt-0.5 shrink-0" />
                      <span className="break-words">{r.rdv.clientAdresse}</span>
                    </a>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                      <a
                        href={`tel:${r.rdv.clientTelephone}`}
                        className="text-areka-navy hover:text-areka-orange inline-flex items-center gap-1 font-medium transition"
                      >
                        <Phone size={12} />
                        {r.rdv.clientTelephone}
                      </a>
                      {r.rdv.clientEmail && (
                        <a
                          href={`mailto:${r.rdv.clientEmail}`}
                          className="text-foreground/70 hover:text-areka-orange inline-flex items-center gap-1 transition"
                        >
                          <Mail size={12} />
                          <span className="hidden sm:inline">{r.rdv.clientEmail}</span>
                          <span className="sm:hidden">Email</span>
                        </a>
                      )}
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-areka-orange hover:underline inline-flex items-center gap-1 font-medium ml-auto"
                      >
                        <Navigation size={12} />
                        Itinéraire
                      </a>
                    </div>
                  </div>
                </div>
                {r.distanceDepuisPrecedent > 0 && (
                  <span className="text-foreground/60 shrink-0 text-xs font-medium sm:self-start">
                    +{Math.round(r.distanceDepuisPrecedent)} km
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/**
 * Panel "Synthèse par zone" : regroupe les RDV par commune (clientCommune
 * extraite via l'autocomplete Pelias). Les RDV legacy sans commune connue
 * sont rangés dans une catégorie dédiée.
 */
function SyntheseParZone({ tournee }: { tournee: TourneeJour }) {
  const groupes = new Map<string, { count: number; ordres: number[]; distance: number }>();

  for (const r of tournee.rdvs) {
    const key = r.rdv.clientCommune?.trim() || '__inconnue__';
    const g = groupes.get(key) ?? { count: 0, ordres: [], distance: 0 };
    g.count += 1;
    g.ordres.push(r.ordre + 1);
    g.distance += r.distanceDepuisPrecedent;
    groupes.set(key, g);
  }

  if (groupes.size === 0) return null;

  // Tri : commune connues d'abord, par nombre de RDV décroissant ; "inconnues" en dernier.
  const entries = [...groupes.entries()].sort(([ka, ga], [kb, gb]) => {
    if (ka === '__inconnue__') return 1;
    if (kb === '__inconnue__') return -1;
    return gb.count - ga.count;
  });

  return (
    <div className="bg-card border-border/50 rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-2">
        <MapPin size={16} className="text-areka-orange" />
        <h3 className="text-sm font-semibold">Synthèse par zone</h3>
        <span className="text-foreground/60 text-xs">
          {entries.length} {entries.length > 1 ? 'communes' : 'commune'}
        </span>
      </div>
      <ul className="space-y-2">
        {entries.map(([key, g]) => {
          const isUnknown = key === '__inconnue__';
          return (
            <li
              key={key}
              className="border-border/30 flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className={isUnknown ? 'text-foreground/60 italic' : 'font-medium'}>
                  {isUnknown ? 'Commune inconnue' : key}
                </p>
                <p className="text-foreground/60 mt-0.5 text-xs">
                  {g.count} RDV · arrêts #{g.ordres.join(', #')}
                </p>
              </div>
              {!isUnknown && g.distance > 0 && (
                <span className="text-foreground/60 shrink-0 text-xs font-medium">
                  ≈ {Math.round(g.distance)} km
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
