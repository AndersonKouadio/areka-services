import { Suspense } from 'react';
import { obtenirStatsRendezVous } from '@/features/rendez-vous/actions/stats.action';
import { obtenirTousRendezVous } from '@/features/rendez-vous/data/rendez-vous.data';
import { obtenirChartsData } from '@/features/rendez-vous/actions/charts.action';
import { KpiCards } from '@/features/rendez-vous/components/admin/KpiCards';
import { RendezVousRecents } from '@/features/rendez-vous/components/admin/RendezVousRecents';
import { ChartsDashboard } from '@/features/rendez-vous/components/admin/charts/ChartsDashboard';

export const metadata = {
  title: 'Tableau de bord',
};

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-foreground/60 mt-1">
          Vue d&apos;ensemble des demandes de rendez-vous.
        </p>
      </header>

      <div className="space-y-8">
        <Suspense fallback={<KpiCardsSkeleton />}>
          <KpiCardsSection />
        </Suspense>
        <Suspense fallback={<ChartsSkeleton />}>
          <ChartsSection />
        </Suspense>
        <Suspense fallback={<RecentsSkeleton />}>
          <RecentsSection />
        </Suspense>
      </div>
    </main>
  );
}

// Sections async — chacune fetch ses propres données et stream indépendamment.
// Page shell s'affiche immédiatement ; les sections apparaissent au fur et à
// mesure que leurs queries répondent.

async function KpiCardsSection() {
  const stats = await obtenirStatsRendezVous();
  return <KpiCards stats={stats} />;
}

async function ChartsSection() {
  const charts = await obtenirChartsData();
  return <ChartsDashboard data={charts} />;
}

async function RecentsSection() {
  const recents = await obtenirTousRendezVous({
    page: 1,
    limit: 8,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  return <RendezVousRecents rendezVous={recents.data} />;
}

// Skeletons — ratios visuels approximatifs des composants finaux.

function KpiCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border-border/50 h-24 animate-pulse rounded-xl border"
        />
      ))}
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="bg-card border-border/50 h-72 animate-pulse rounded-xl border" />
      <div className="bg-card border-border/50 h-72 animate-pulse rounded-xl border" />
      <div className="bg-card border-border/50 h-72 animate-pulse rounded-xl border" />
      <div className="bg-card border-border/50 h-72 animate-pulse rounded-xl border" />
    </div>
  );
}

function RecentsSkeleton() {
  return (
    <div className="bg-card border-border/50 overflow-hidden rounded-xl border">
      <div className="border-border/50 h-14 border-b px-5 py-4">
        <div className="bg-muted/60 h-5 w-40 animate-pulse rounded" />
      </div>
      <div className="divide-border/40 divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3">
            <div className="bg-muted/60 h-4 flex-1 animate-pulse rounded" />
            <div className="bg-muted/60 h-5 w-20 animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
