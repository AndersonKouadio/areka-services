import { TourneeView } from '@/features/tournee/components/TourneeView';

export const metadata = {
  title: 'Tournée',
};

export default function TourneePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tournée du jour</h1>
        <p className="text-foreground/60 mt-1">
          Visualisez l&apos;ordre optimisé de vos interventions par proximité
          géographique.
        </p>
      </header>

      <TourneeView />
    </main>
  );
}
