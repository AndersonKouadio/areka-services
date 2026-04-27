import { VueRendezVousToggle } from '@/features/rendez-vous/components/admin/VueRendezVousToggle';
import { RendezVousAdminContent } from '@/features/rendez-vous/components/admin/RendezVousAdminContent';

export const metadata = {
  title: 'Rendez-vous',
};

export default function RendezVousAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-foreground/60 mt-1">
            Toutes les demandes de rendez-vous.
          </p>
        </div>
        <VueRendezVousToggle />
      </header>

      <RendezVousAdminContent />
    </main>
  );
}
