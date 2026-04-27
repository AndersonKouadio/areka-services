import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FormulaireRendezVous } from '@/features/rendez-vous/components/FormulaireRendezVous';

export const metadata = {
  title: 'Prendre rendez-vous',
  description:
    'Réservez votre intervention chauffage en ligne. Confirmation sous 24h par email et SMS.',
};

export default function RendezVousPage() {
  return (
    <main className="from-areka-cream to-background mx-auto min-h-[calc(100vh-200px)] bg-linear-to-b">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Link
          href="/"
          className="text-foreground/60 hover:text-foreground inline-flex items-center gap-1 text-sm transition"
        >
          <ArrowLeft size={14} />
          Retour à l&apos;accueil
        </Link>

        <div className="mt-6 mb-10 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
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
