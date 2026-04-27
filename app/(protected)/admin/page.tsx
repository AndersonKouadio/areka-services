import { obtenirStatsRendezVous } from '@/features/rendez-vous/actions/stats.action';
import { obtenirTousRendezVous } from '@/features/rendez-vous/actions/rendez-vous.actions';
import { KpiCards } from '@/features/rendez-vous/components/admin/KpiCards';
import { RendezVousRecents } from '@/features/rendez-vous/components/admin/RendezVousRecents';

export const metadata = {
  title: 'Tableau de bord',
};

export default async function AdminDashboardPage() {
  const [stats, recents] = await Promise.all([
    obtenirStatsRendezVous(),
    obtenirTousRendezVous({
      page: 1,
      limit: 8,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-foreground/60 mt-1">
          Vue d&apos;ensemble des demandes de rendez-vous.
        </p>
      </header>

      <div className="space-y-8">
        <KpiCards stats={stats} />
        <RendezVousRecents rendezVous={recents.data} />
      </div>
    </main>
  );
}
