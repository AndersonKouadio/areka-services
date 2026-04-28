/**
 * Client minimal OpenRouteService.
 * Doc : https://openrouteservice.org/dev/#/api-docs
 *
 * 2 endpoints utilisés :
 *  - /geocode/search : adresse texte → coordonnées
 *  - /optimization : ordonner une liste de coordonnées par tournée optimale
 */

const ORS_BASE = 'https://api.openrouteservice.org';

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface AdresseGeocodee {
  adresse: string;
  coords: Coordinates | null;
}

/**
 * Cache geocoding en mémoire (vit le temps du process serveur).
 * Évite de re-géocoder la même adresse à chaque calcul de tournée.
 * TTL: jamais expiré dans le process. Vidé au redémarrage.
 */
const geocodeCache = new Map<string, Coordinates | null>();

function cacheKey(adresse: string): string {
  return adresse.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Géocode une adresse FR en coordonnées (lng, lat).
 * Renvoie null si introuvable ou clé API absente.
 */
export async function geocoderAdresse(
  adresse: string
): Promise<Coordinates | null> {
  const key = cacheKey(adresse);
  if (geocodeCache.has(key)) {
    return geocodeCache.get(key) ?? null;
  }

  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  if (!apiKey) {
    console.warn('[ors] OPENROUTESERVICE_API_KEY absente — geocoding skipped');
    return null;
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      text: adresse,
      size: '1',
    });
    const res = await fetch(`${ORS_BASE}/geocode/search?${params}`, {
      // Timeout côté ORS : pas plus de 8 s pour ne pas bloquer la route
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      geocodeCache.set(key, null);
      return null;
    }
    const data = (await res.json()) as {
      features?: { geometry?: { coordinates?: [number, number] } }[];
    };
    const coords = data.features?.[0]?.geometry?.coordinates;
    if (!coords) {
      geocodeCache.set(key, null);
      return null;
    }
    const result = { lng: coords[0], lat: coords[1] };
    geocodeCache.set(key, result);
    return result;
  } catch (e) {
    console.error('[ors] geocode error', e);
    return null;
  }
}

/**
 * Calcule l'ordre optimal de visite des points depuis le point de départ.
 * Renvoie l'index d'ordre pour chaque RDV (tableau d'indices).
 *
 * v1 minimaliste : utilise un tri par proximité (nearest neighbour) côté serveur
 * sans appeler ORS Optimization (qui coûte des tokens).
 * Pour un volume de RDV/jour < 10, c'est suffisant.
 */
export function calculerOrdreNearestNeighbour(
  depart: Coordinates,
  points: { id: string; coords: Coordinates }[]
): { id: string; ordre: number; distanceKm: number }[] {
  if (points.length === 0) return [];

  const reste = [...points];
  const result: { id: string; ordre: number; distanceKm: number }[] = [];
  let courant = depart;
  let i = 0;

  while (reste.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let j = 0; j < reste.length; j++) {
      const d = haversineKm(courant, reste[j].coords);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = j;
      }
    }
    const next = reste.splice(bestIdx, 1)[0];
    result.push({ id: next.id, ordre: i++, distanceKm: bestDist });
    courant = next.coords;
  }

  return result;
}

/** Distance Haversine entre 2 points (km). */
function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const x =
    sinLat * sinLat + sinLng * sinLng * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}
