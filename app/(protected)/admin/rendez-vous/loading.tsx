/**
 * Skeleton dédié /admin/rendez-vous : matche le layout final
 * (filtres + table) pour minimiser le shift visuel quand la page arrive.
 */
export default function RendezVousLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="bg-muted/60 h-10 w-36 animate-pulse rounded-lg" />
      </div>

      {/* Filtres */}
      <div className="bg-card border-border/50 flex flex-wrap items-center gap-3 rounded-xl border p-4">
        <div className="bg-muted/60 h-10 min-w-64 flex-1 animate-pulse rounded-lg" />
        <div className="bg-muted/60 h-10 w-44 animate-pulse rounded-lg" />
        <div className="bg-muted/60 h-10 w-44 animate-pulse rounded-lg" />
      </div>

      {/* Table */}
      <div className="bg-card border-border/50 overflow-hidden rounded-xl border">
        <div className="bg-muted/40 border-border/50 h-12 border-b" />
        <div className="divide-border/40 divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="bg-muted/50 h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted/50 h-4 flex-1 animate-pulse rounded" />
              <div className="bg-muted/50 h-5 w-20 animate-pulse rounded-full" />
              <div className="bg-muted/50 h-5 w-24 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
