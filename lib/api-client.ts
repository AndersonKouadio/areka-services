/**
 * Client HTTP minimal pour les Route Handlers internes (/api/*).
 *
 * Utilisé par la couche features/.../apis/ — appelée depuis les
 * client components via TanStack Query.
 *
 * Les Server Components ne passent PAS par ce client : ils importent
 * directement les fonctions data (Prisma) pour éviter un hop HTTP.
 *
 * Pattern aligné avec ak-starters frontend (apis/ + apiClient).
 */

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body?: unknown,
  ) {
    super(`HTTP ${status} ${statusText}`);
    this.name = 'ApiClientError';
  }
}

type Params = Record<string, string | number | boolean | null | undefined>;

function buildUrl(path: string, params?: Params): string {
  // Path relatif (commence par /) — résolu sur l'origine courante côté client.
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!params) return normalized;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${normalized}?${qs}` : normalized;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text().catch(() => '');
    }
    throw new ApiClientError(res.status, res.statusText, body);
  }
  // Réponse 204 No Content → undefined typé
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiClient = {
  get: async <T>(path: string, options?: { params?: Params }): Promise<T> => {
    const url = buildUrl(path, options?.params);
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<T>(res);
  },

  post: async <T>(path: string, body?: unknown): Promise<T> => {
    const res = await fetch(buildUrl(path), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },
};
