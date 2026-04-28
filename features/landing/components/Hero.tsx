import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <section className="from-areka-cream to-background relative overflow-hidden bg-linear-to-b pt-10 pb-20 sm:pt-16 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:px-8 md:grid-cols-2 md:gap-16">
        <div className="space-y-7">
          <div className="bg-surface/80 border-border/60 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
            <span className="bg-areka-green size-2 animate-pulse rounded-full" />
            Disponible cette semaine
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-balance">
            Votre chauffage,
            <br />
            <span className="text-gradient-areka">entre de bonnes mains.</span>
          </h1>
          <p className="text-foreground/70 max-w-md text-base sm:text-lg leading-relaxed">
            Entretien annuel et dépannage rapide à Cholet et dans tout le
            Maine-et-Loire. Prenez rendez-vous en ligne en moins de 2 minutes.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/rendez-vous" className="button button--primary">
              Prendre rendez-vous
            </Link>
            <Link href="#services" className="button button--outline">
              Découvrir nos services
            </Link>
          </div>
          <div className="text-foreground/60 flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm">
            <div className="flex items-center gap-2">
              <Star size={16} className="fill-areka-amber text-areka-amber" />
              <span>15 ans d&apos;expérience</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-areka-navy" />
              <span>Cholet & 50 km</span>
            </div>
          </div>
        </div>

        <div className="relative mt-4 md:mt-0">
          <div className="border-border/50 relative aspect-3/4 overflow-hidden rounded-3xl border shadow-2xl">
            <Image
              src="/julien.jpeg"
              alt="Julien Ligner — chauffagiste Areka Services"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          </div>
          <div className="bg-surface border-border/50 absolute -bottom-6 left-4 sm:-left-6 rounded-2xl border px-5 py-4 shadow-xl">
            <p className="font-semibold leading-tight">Julien Ligner</p>
            <p className="text-foreground/60 text-sm mt-0.5">
              Chauffagiste — Areka Services
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
