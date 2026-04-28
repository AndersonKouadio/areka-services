import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FormulaireRendezVous } from '@/features/rendez-vous/components/FormulaireRendezVous';

export const metadata = {
  title: 'Nouveau rendez-vous',
};

export default function NouveauRendezVousPage() {
  return (
    <main className="from-areka-cream to-background w-full min-h-[calc(100vh-200px)] bg-linear-to-b">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Link
          href="/admin/rendez-vous"
          className="text-foreground/60 hover:text-foreground inline-flex items-center gap-1 text-sm transition"
        >
          <ArrowLeft size={14} />
          Retour à la liste
        </Link>

        <div className="mt-6 mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Nouveau{' '}
            <span className="text-gradient-areka">rendez-vous</span>
          </h1>
          <p className="text-foreground/70 mt-3">
            Saisie manuelle pour les RDV pris au téléphone. Le rendez-vous
            est créé directement en statut confirmé.
          </p>
        </div>

        <FormulaireRendezVous mode="admin" />
      </div>
    </main>
  );
}
