import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function InfoAreka() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="border-border/50 relative size-12 overflow-hidden rounded-full border">
          <Image
            src="/julien.jpeg"
            alt="Julien Ligner"
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold">Julien Ligner</p>
          <p className="text-foreground/60 text-xs">
            Chauffagiste — Areka Services
          </p>
        </div>
      </div>

      <div>
        <p className="text-foreground/60 text-xs uppercase tracking-wider">
          Prendre rendez-vous
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-tight">
          Réservez un créneau
        </h2>
        <p className="text-foreground/70 mt-3 text-sm leading-relaxed">
          Quelques minutes pour décrire votre besoin. On vous confirme sous 24h
          par email et SMS.
        </p>
      </div>

      <div className="bg-muted/40 border-border/40 space-y-3 rounded-xl border p-4 text-sm">
        <div className="flex items-start gap-2">
          <Clock size={16} className="text-areka-navy mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Horaires</p>
            <p className="text-foreground/60 text-xs">
              Lun-Ven : 8h30 — 18h30
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-areka-navy mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Zone d&apos;intervention</p>
            <p className="text-foreground/60 text-xs">
              Cholet & Maine-et-Loire (50 km)
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone size={16} className="text-areka-navy mt-0.5 shrink-0" />
          <a
            href="tel:+33769401093"
            className="hover:text-areka-orange transition"
          >
            +33 7 69 40 10 93
          </a>
        </div>
        <div className="flex items-start gap-2">
          <Mail size={16} className="text-areka-navy mt-0.5 shrink-0" />
          <a
            href="mailto:arekaservices@gmail.com"
            className="hover:text-areka-orange break-all transition"
          >
            arekaservices@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
