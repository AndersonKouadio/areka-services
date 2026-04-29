import Link from 'next/link';
import Image from 'next/image';
import { Phone } from 'lucide-react';

export function Header() {
  return (
    <header className="border-border/50 bg-background/85 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
        <Link
          href="/"
          aria-label="Accueil Areka Services"
          className="shrink-0"
        >
          <Image
            src="/logo.png"
            alt="Areka Services"
            width={180}
            height={120}
            priority
            className="h-12 w-auto sm:h-16"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="tel:+33769401093"
            className="text-foreground hover:text-accent inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition"
            aria-label="Appeler Areka Services"
          >
            <Phone size={16} />
            <span className="hidden sm:inline">07 69 40 10 93</span>
            <span className="sm:hidden">Appeler</span>
          </a>
          <Link
            href="/auth/sign-in"
            className="text-foreground/60 hover:text-foreground hidden text-sm transition sm:inline"
          >
            Espace pro
          </Link>
        </div>
      </div>
    </header>
  );
}
