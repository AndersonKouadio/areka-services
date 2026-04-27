import Link from 'next/link';
import { CheckCircle2, Mail, Phone } from 'lucide-react';

export function SuccessRendezVous({ reference }: { reference: string }) {
  return (
    <div className="mx-auto max-w-md py-8 text-center">
      <div className="bg-areka-green/10 text-areka-green mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
        <CheckCircle2 size={36} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">
        Demande enregistrée&nbsp;!
      </h2>
      <p className="text-foreground/70 mt-2">
        Nous avons bien reçu votre demande de rendez-vous.
      </p>

      <div className="bg-muted/50 border-border/40 mt-6 rounded-xl border p-4 text-left">
        <p className="text-foreground/60 text-xs uppercase tracking-wider">
          Référence
        </p>
        <p className="mt-1 font-mono text-lg font-semibold">{reference}</p>
        <p className="text-foreground/60 mt-2 text-xs">
          Conservez cette référence pour tout échange avec Areka Services.
        </p>
      </div>

      <div className="mt-6 space-y-2 text-left text-sm">
        <p className="font-medium">Et maintenant&nbsp;?</p>
        <p className="text-foreground/70 flex items-start gap-2">
          <Mail size={16} className="mt-0.5 shrink-0" />
          Un email de confirmation vous a été envoyé.
        </p>
        <p className="text-foreground/70 flex items-start gap-2">
          <Phone size={16} className="mt-0.5 shrink-0" />
          Julien vous contactera sous 24h pour valider le rendez-vous.
        </p>
      </div>

      <Link
        href="/"
        className="button button--outline mt-8 inline-flex w-full sm:w-auto"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
