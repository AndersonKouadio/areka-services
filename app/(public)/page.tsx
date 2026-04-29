import { FormulaireRendezVous } from '@/features/rendez-vous/components/FormulaireRendezVous';

export const metadata = {
  title: 'Prendre rendez-vous',
  description:
    'Réservez votre intervention chauffage en ligne avec Areka Services à Cholet et dans tout le Maine-et-Loire. Confirmation sous 24h par email et SMS.',
};

export default function HomePage() {
  return (
    <main className="from-areka-cream to-background w-full min-h-[calc(100vh-200px)] bg-linear-to-b">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Prendre <span className="text-gradient-areka">rendez-vous</span>
          </h1>
          <p className="text-foreground/70 mt-3">
            Décrivez votre besoin en quelques étapes. Nous confirmons votre
            créneau sous 24h par email et SMS.
          </p>
        </div>

        <FormulaireRendezVous />
      </div>
    </main>
  );
}
