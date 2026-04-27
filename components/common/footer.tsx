import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-border/50 bg-muted/40 mt-24 border-t"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:px-8 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-semibold">Areka Services</h3>
          <p className="text-foreground/70 mt-3 text-sm leading-relaxed">
            Entretien et dépannage de chauffage à Cholet et dans tout le
            Maine-et-Loire. Artisan local indépendant.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-3 space-y-2 text-sm">
            <a
              href="tel:+33769401093"
              className="hover:text-areka-orange flex items-center gap-2 transition"
            >
              <Phone size={16} className="text-areka-navy" />
              07 69 40 10 93
            </a>
            <a
              href="mailto:arekaservices@gmail.com"
              className="hover:text-areka-orange flex items-center gap-2 transition"
            >
              <Mail size={16} className="text-areka-navy" />
              arekaservices@gmail.com
            </a>
            <p className="text-foreground/70 flex items-center gap-2">
              <MapPin size={16} className="text-areka-navy" />
              Lieu-dit l&apos;Hermitage, 49300 Cholet
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Liens</h3>
          <div className="mt-3 space-y-2 text-sm">
            <Link
              href="/rendez-vous"
              className="hover:text-areka-orange block transition"
            >
              Prendre rendez-vous
            </Link>
            <Link
              href="/auth/sign-in"
              className="hover:text-areka-orange block transition"
            >
              Espace pro
            </Link>
          </div>
        </div>
      </div>
      <div className="border-border/50 border-t">
        <p className="text-foreground/50 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 text-xs">
          © {new Date().getFullYear()} Areka Services — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
