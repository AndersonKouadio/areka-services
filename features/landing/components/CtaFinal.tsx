import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

export function CtaFinal() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
      <div className="gradient-areka relative overflow-hidden rounded-3xl px-6 py-14 sm:px-12 sm:py-20 text-center text-white shadow-xl">
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
        <div className="relative mx-auto max-w-2xl">
          <div className="bg-white/15 border-white/20 mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Clock size={14} />
            Réponse sous 24h
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
            Prêt à prendre rendez-vous&nbsp;?
          </h2>
          <p className="mt-5 text-white/85 text-lg leading-relaxed">
            Choisissez un créneau qui vous arrange. Nous confirmons sous 24h par
            email et SMS.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/rendez-vous"
              className="bg-white text-areka-navy hover:bg-white/90 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-md transition"
            >
              <Calendar size={16} />
              Réserver mon créneau
            </Link>
            <a
              href="tel:+33769401093"
              className="border-white/30 text-white hover:bg-white/10 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition"
            >
              07 69 40 10 93
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
