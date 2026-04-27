import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { obtenirRendezVousParId } from '@/features/rendez-vous/actions/rendez-vous.actions';
import { DetailRendezVous } from '@/features/rendez-vous/components/admin/DetailRendezVous';
import { ActionsRendezVous } from '@/features/rendez-vous/components/admin/ActionsRendezVous';

export default async function RendezVousDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rdv = await obtenirRendezVousParId(id);
  if (!rdv) notFound();

  return (
    <main className="mx-auto max-w-4xl px-8 py-8">
      <Link
        href="/admin/rendez-vous"
        className="text-foreground/60 hover:text-foreground inline-flex items-center gap-1 text-sm transition"
      >
        <ArrowLeft size={14} />
        Retour aux rendez-vous
      </Link>

      <header className="mt-6 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {rdv.clientPrenom} {rdv.clientNom}
        </h1>
        <p className="text-foreground/60 mt-1 text-sm">
          Détail de la demande
        </p>
      </header>

      <div className="space-y-6">
        <DetailRendezVous rdv={rdv} />
        <ActionsRendezVous rdvId={rdv.id} statut={rdv.statut} />
      </div>
    </main>
  );
}
