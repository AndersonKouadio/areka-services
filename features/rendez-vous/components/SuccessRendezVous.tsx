import Link from 'next/link';
import { CheckCircle2, Mail, Phone, ArrowRight } from 'lucide-react';

interface SuccessRendezVousProps {
  reference: string;
  /**
   * 'public' = page client, 'admin' = création manuelle dans l'admin.
   */
  mode?: 'public' | 'admin';
}

export function SuccessRendezVous({
  reference,
  mode = 'public',
}: SuccessRendezVousProps) {
  const isAdmin = mode === 'admin';

  return (
    <div className="mx-auto max-w-md py-8 text-center">
      <div className="bg-areka-green/10 text-areka-green mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
        <CheckCircle2 size={36} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">
        {isAdmin ? 'Rendez-vous créé !' : 'Demande enregistrée !'}
      </h2>
      <p className="text-foreground/70 mt-2">
        {isAdmin
          ? 'Le rendez-vous est confirmé et le client a été notifié.'
          : 'Nous avons bien reçu votre demande de rendez-vous.'}
      </p>

      <div className="bg-muted/50 border-border/40 mt-6 rounded-xl border p-4 text-left">
        <p className="text-foreground/60 text-xs uppercase tracking-wider">
          Référence
        </p>
        <p className="mt-1 font-mono text-lg font-semibold">{reference}</p>
        <p className="text-foreground/60 mt-2 text-xs">
          {isAdmin
            ? 'Référence transmise au client par email + SMS.'
            : 'Conservez cette référence pour tout échange avec Areka Services.'}
        </p>
      </div>

      <div className="mt-6 space-y-2 text-left text-sm">
        <p className="font-medium">Et maintenant&nbsp;?</p>
        <p className="text-foreground/70 flex items-start gap-2">
          <Mail size={16} className="mt-0.5 shrink-0" />
          {isAdmin
            ? 'Email de confirmation envoyé au client.'
            : 'Un email de confirmation vous a été envoyé.'}
        </p>
        <p className="text-foreground/70 flex items-start gap-2">
          <Phone size={16} className="mt-0.5 shrink-0" />
          {isAdmin
            ? 'SMS envoyé au client avec la date et le créneau.'
            : 'Julien vous contactera sous 24h pour valider le rendez-vous.'}
        </p>
      </div>

      {isAdmin ? (
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/admin/rendez-vous"
            className="button button--primary inline-flex"
          >
            Retour à la liste
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/admin/rendez-vous/nouveau"
            className="button button--outline inline-flex"
          >
            Créer un autre RDV
          </Link>
        </div>
      ) : (
        <Link
          href="/"
          className="button button--outline mt-8 inline-flex w-full sm:w-auto"
        >
          Retour à l&apos;accueil
        </Link>
      )}
    </div>
  );
}
