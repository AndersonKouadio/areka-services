import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <section className="from-areka-cream to-background relative overflow-hidden bg-linear-to-b pt-8 pb-16 sm:pt-12 sm:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-areka-cream/60 border-border/60 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur">
            <span className="bg-areka-green size-2 animate-pulse rounded-full" />
            Disponible cette semaine
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            Votre chauffage,
            <br />
            <span className="text-gradient-areka">entre de bonnes mains.</span>
          </h1>
          <p className="text-foreground/70 max-w-md text-lg">
            Entretien annuel et dépannage rapide à Cholet et dans tout le
            Maine-et-Loire. Prenez rendez-vous en ligne en moins de 2 minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/rendez-vous" className="button button--primary">
              Prendre rendez-vous
            </Link>
            <Link href="#services" className="button button--outline">
              Découvrir nos services
            </Link>
          </div>
          <div className="text-foreground/60 flex items-center gap-6 pt-2 text-sm">
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

        <div className="relative">
          <div className="border-border/50 relative aspect-3/4 overflow-hidden rounded-2xl border shadow-xl">
            <Image
              src="/julien.jpeg"
              alt="Julien Ligner — chauffagiste Areka Services"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          </div>
          <div className="bg-card border-border/50 absolute -bottom-5 -left-5 rounded-xl border p-4 shadow-md">
            <p className="font-semibold">Julien Ligner</p>
            <p className="text-foreground/60 text-sm">
              Chauffagiste — Areka Services
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
