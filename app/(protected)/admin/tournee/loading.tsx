/**
 * Skeleton dédié /admin/tournee : calendrier à gauche + map/contenu à droite,
 * matche le layout existant pour un swap smooth quand le serveur répond.
 */
export default function TourneeLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="bg-muted/60 h-9 w-48 animate-pulse rounded-lg" />
        <div className="bg-muted/40 mt-2 h-4 w-96 animate-pulse rounded" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="bg-card border-border/50 h-[420px] w-full animate-pulse rounded-xl border" />
        <div className="space-y-4">
          <div className="bg-card border-border/50 h-16 animate-pulse rounded-xl border" />
          <div className="bg-card border-border/50 h-[400px] animate-pulse rounded-xl border" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border-border/50 h-20 animate-pulse rounded-xl border"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
