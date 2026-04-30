import 'server-only';
import { cache } from 'react';
import { headers } from 'next/headers';
import { auth } from './auth';

/**
 * Récupère la session active. **Memoizé par requête** via React cache() :
 * tous les layouts, pages et server actions appelés dans la même requête
 * partagent UN SEUL hit DB (au lieu de 6+ avant). Économie majeure quand
 * le DB Neon est en eu-west-2 et la fonction Vercel en US East.
 *
 * Toujours utiliser ce helper, jamais auth.api.getSession() directement.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * Variante stricte : redirige vers sign-in si pas de session OU throw
 * `Non autorisé` (selon le contexte). À utiliser dans les server actions
 * qui doivent juste vérifier l'auth et continuer.
 */
export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error('Non autorisé');
  return session;
}
