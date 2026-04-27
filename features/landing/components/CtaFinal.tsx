import Link from 'next/link';

export function CtaFinal() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
        Prêt à prendre rendez-vous&nbsp;?
      </h2>
      <p className="text-foreground/70 mb-8">
        Choisissez un créneau qui vous arrange. Nous confirmons sous 24h par
        email et SMS.
      </p>
      <Link href="/rendez-vous" className="button button--primary">
        Réserver mon créneau
      </Link>
    </section>
  );
}
