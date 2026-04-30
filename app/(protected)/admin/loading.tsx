import { Loader2 } from 'lucide-react';

/**
 * Affiché automatiquement par Next.js pendant la navigation entre pages
 * /admin/*. Visible immédiatement au tap BottomNav / lien — couvre la
 * latence serveur (auth + queries) sans page blanche.
 *
 * Une page-spécifique loading.tsx peut surcharger ce fichier (ex: skeleton
 * dédié /admin/rendez-vous avec table fantôme).
 */
export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-8">
        <div className="bg-muted/60 h-9 w-64 animate-pulse rounded-lg" />
        <div className="bg-muted/40 mt-2 h-4 w-80 animate-pulse rounded" />
      </div>

      <div className="space-y-6">
        <div className="text-foreground/40 flex items-center justify-center gap-2 py-12 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Chargement...
        </div>
      </div>
    </div>
  );
}
