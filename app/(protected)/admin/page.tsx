import { obtenirStatsRendezVous } from '@/features/rendez-vous/actions/stats.action';
import { obtenirTousRendezVous } from '@/features/rendez-vous/actions/rendez-vous.actions';
import { obtenirChartsData } from '@/features/rendez-vous/actions/charts.action';
import { KpiCards } from '@/features/rendez-vous/components/admin/KpiCards';
import { RendezVousRecents } from '@/features/rendez-vous/components/admin/RendezVousRecents';
import { ChartsDashboard } from '@/features/rendez-vous/components/admin/charts/ChartsDashboard';

export const metadata = {
  title: 'Tableau de bord',
};

export default async function AdminDashboardPage() {
  const [stats, recents, charts] = await Promise.all([
    obtenirStatsRendezVous(),
    obtenirTousRendezVous({
      page: 1,
      limit: 8,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    obtenirChartsData(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-foreground/60 mt-1">
          Vue d&apos;ensemble des demandes de rendez-vous.
        </p>
      </header>

      <div className="space-y-8">
        <KpiCards stats={stats} />
        <ChartsDashboard data={charts} />
        <RendezVousRecents rendezVous={recents.data} />
      </div>
    </main>
  );
}
