/**
 * Client minimal OpenRouteService.
 * Doc : https://openrouteservice.org/dev/#/api-docs
 *
 * 3 endpoints utilisés :
 *  - /geocode/search       : adresse texte → coordonnées (1 résultat)
 *  - /geocode/autocomplete : suggestions d'adresses (typeahead)
 *  - /optimization         : ordonner une liste de coordonnées (non utilisé ici)
 *
 * Note : api.openrouteservice.org est annoncé en déprécation au profit
 * de api.heigit.org sur le dashboard, mais ce dernier renvoie 404 sur tous
 * les paths à ce jour (vérifié 2026-04-29). À switcher quand activé.
 */

const ORS_BASE = 'https://api.openrouteservice.org';

// Focus sur Cholet (49300) pour prioriser les suggestions locales.
const FOCUS_CHOLET = { lat: 47.0617, lng: -0.8786 };

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface AdresseGeocodee {
  adresse: string;
  coords: Coordinates | null;
}

export interface SuggestionAdresse {
  /** Adresse complète et normalisée (ex: "12 Rue de la Paix, 49300 Cholet, France") */
  label: string;
  coords: Coordinates;
  /** Identifiant Pelias (gid) — clé stable pour key React */
  id: string;
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
      // Restreint à la France + boost les résultats autour de Cholet
      // (zone d'intervention Areka). Évite les faux positifs sur des adresses
      // homonymes à l'étranger.
      'boundary.country': 'FRA',
      'focus.point.lat': String(FOCUS_CHOLET.lat),
      'focus.point.lon': String(FOCUS_CHOLET.lng),
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
 * Erreurs typées remontées par autocompleteAdresse.
 * - 'network'       : timeout, DNS, fetch raté
 * - 'rate_limit'    : HTTP 429 (quota dépassé ou trop rapide)
 * - 'server'        : HTTP 5xx
 * - 'client'        : HTTP 4xx autre que 429 (clé invalide, payload bad)
 *
 * Les erreurs traversent en throw vers TanStack Query → isError=true.
 * Le composant peut alors afficher un message clair tout en laissant la
 * saisie libre fonctionner (autocomplete = best-effort).
 */
export class OrsAutocompleteError extends Error {
  constructor(
    public readonly kind: 'network' | 'rate_limit' | 'server' | 'client',
    public readonly userMessage: string,
    public readonly httpStatus?: number,
  ) {
    super(`${kind}: ${userMessage}${httpStatus ? ` (HTTP ${httpStatus})` : ''}`);
    this.name = 'OrsAutocompleteError';
  }
}

/**
 * Suggestions d'adresses en temps réel (typeahead).
 * Priorise les résultats français autour de Cholet.
 *
 * Retourne [] si :
 *  - requête < 3 chars (économie de tokens)
 *  - clé API absente (config manquante, no-op silencieux)
 *  - réponse 200 sans features (pas de match — comportement normal)
 *
 * Throw OrsAutocompleteError si :
 *  - timeout / réseau
 *  - HTTP non-2xx
 *  - JSON invalide
 */
export async function autocompleteAdresse(
  query: string,
  size: number = 5
): Promise<SuggestionAdresse[]> {
  if (query.trim().length < 3) return [];

  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  if (!apiKey) {
    console.warn('[ors] OPENROUTESERVICE_API_KEY absente — autocomplete skipped');
    return [];
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    text: query.trim(),
    size: String(size),
    'boundary.country': 'FRA',
    'focus.point.lat': String(FOCUS_CHOLET.lat),
    'focus.point.lon': String(FOCUS_CHOLET.lng),
  });

  let res: Response;
  try {
    res = await fetch(`${ORS_BASE}/geocode/autocomplete?${params}`, {
      signal: AbortSignal.timeout(5000),
    });
  } catch (e) {
    console.error('[ors] autocomplete network error', e);
    throw new OrsAutocompleteError(
      'network',
      "Service de recherche d'adresse indisponible. Vérifiez votre connexion."
    );
  }

  if (res.status === 429) {
    throw new OrsAutocompleteError(
      'rate_limit',
      'Trop de requêtes — patientez quelques secondes.',
      429,
    );
  }
  if (res.status >= 500) {
    throw new OrsAutocompleteError(
      'server',
      "Service de recherche temporairement indisponible.",
      res.status,
    );
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[ors] autocomplete HTTP', res.status, body.slice(0, 200));
    throw new OrsAutocompleteError(
      'client',
      "Impossible d'obtenir des suggestions d'adresse.",
      res.status,
    );
  }

  let data: {
    features?: {
      properties?: { label?: string; gid?: string };
      geometry?: { coordinates?: [number, number] };
    }[];
  };
  try {
    data = await res.json();
  } catch (e) {
    console.error('[ors] autocomplete JSON parse', e);
    throw new OrsAutocompleteError(
      'server',
      "Réponse invalide du service de recherche."
    );
  }

  return (data.features ?? []).flatMap((f, idx) => {
    const coords = f.geometry?.coordinates;
    const label = f.properties?.label;
    if (!coords || !label) return [];
    return [{
      label,
      coords: { lng: coords[0], lat: coords[1] },
      id: f.properties?.gid ?? `pelias-${idx}-${label}`,
    }];
  });
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
