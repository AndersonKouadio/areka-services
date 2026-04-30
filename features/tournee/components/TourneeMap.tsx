'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { TourneeJour } from '../types/tournee.type';

const COLOR_DEPART = '#F97316'; // areka-orange
const COLOR_RDV = '#1E3A5F'; // areka-navy

function makeNumberedIcon(label: string, color: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="background:${color};color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-family:system-ui,sans-serif;">${label}</div>`,
    className: 'areka-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });
}

interface TourneeMapProps {
  tournee: TourneeJour;
}

export default function TourneeMap({ tournee }: TourneeMapProps) {
  const points = tournee.rdvs.filter((r) => r.coords);

  if (points.length === 0) {
    return (
      <div className="bg-muted/30 border-border/50 text-foreground/50 flex h-64 items-center justify-center rounded-xl border text-sm">
        Aucun rendez-vous géolocalisé pour cette journée.
      </div>
    );
  }

  // Tracé du trajet : départ → 1 → 2 → 3 ... (ligne droite, pas de route réelle).
  // Pour passer en vraie route routière plus tard : remplacer ces coords par
  // celles renvoyées par ORS Directions (/v2/directions/driving-car).
  const routePath: [number, number][] = [
    [tournee.depart.lat, tournee.depart.lng],
    ...points.map((r) => [r.coords!.lat, r.coords!.lng] as [number, number]),
  ];

  return (
    // isolation:isolate crée un stacking context : les z-index internes de
    // Leaflet (controls z-1000, panes z-400) restent confinés à ce conteneur
    // et ne couvrent plus la BottomNav (z-40) ni le MobileDrawer (z-50).
    <div className="border-border/50 bg-card relative isolate overflow-hidden rounded-xl border">
      <MapContainer
        center={[tournee.depart.lat, tournee.depart.lng]}
        zoom={11}
        scrollWheelZoom={false}
        className="h-[400px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={routePath}
          pathOptions={{
            color: COLOR_DEPART,
            weight: 3,
            opacity: 0.7,
            dashArray: '8 6',
          }}
        />
        <Marker
          position={[tournee.depart.lat, tournee.depart.lng]}
          icon={makeNumberedIcon('A', COLOR_DEPART)}
        >
          <Popup>
            <strong>Areka Services</strong>
            <br />
            Lieu-dit l&apos;Hermitage, 49300 Cholet
          </Popup>
        </Marker>
        {points.map((r) => (
          <Marker
            key={r.rdv.id}
            position={[r.coords!.lat, r.coords!.lng]}
            icon={makeNumberedIcon(String(r.ordre + 1), COLOR_RDV)}
          >
            <Popup>
              <strong>
                {r.rdv.clientPrenom} {r.rdv.clientNom}
              </strong>
              <br />
              {formaterCreneau(r.rdv.creneau)}
              <br />
              <span style={{ fontSize: 11, color: '#6b7280' }}>
                {r.rdv.clientAdresse}
              </span>
            </Popup>
          </Marker>
        ))}
        <FitBounds tournee={tournee} />
      </MapContainer>
    </div>
  );
}

/** Ajuste le viewport pour englober tous les markers + le départ. */
function FitBounds({ tournee }: { tournee: TourneeJour }) {
  const map = useMap();
  const lastKey = useRef<string>('');

  useEffect(() => {
    const points: [number, number][] = [
      [tournee.depart.lat, tournee.depart.lng],
      ...tournee.rdvs
        .filter((r) => r.coords)
        .map((r) => [r.coords!.lat, r.coords!.lng] as [number, number]),
    ];

    // Évite le re-fit infini si la tournée n'a pas changé
    const key = points.map((p) => p.join(',')).join('|');
    if (key === lastKey.current) return;
    lastKey.current = key;

    if (points.length === 1) {
      map.setView(points[0], 13);
    } else {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, tournee]);

  return null;
}
