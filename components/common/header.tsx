'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

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

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/#services"
            className="hover:text-areka-orange transition"
          >
            Nos services
          </Link>
          <Link
            href="/#pourquoi"
            className="hover:text-areka-orange transition"
          >
            Pourquoi nous
          </Link>
          <Link
            href="/#contact"
            className="hover:text-areka-orange transition"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/sign-in"
            className="text-foreground/60 hover:text-foreground hidden text-sm transition sm:inline"
          >
            Espace pro
          </Link>
          <Link href="/rendez-vous" className="button button--primary">
            Prendre RDV
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            className="hover:bg-muted/60 inline-flex size-10 items-center justify-center rounded-lg transition md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`border-border/50 overflow-hidden border-t bg-background/95 backdrop-blur-md transition-all duration-200 ease-out md:hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm font-medium sm:px-6 lg:px-8">
          <Link
            href="/#services"
            onClick={close}
            className="hover:bg-muted/60 hover:text-areka-orange rounded-md px-3 py-2 transition"
          >
            Nos services
          </Link>
          <Link
            href="/#pourquoi"
            onClick={close}
            className="hover:bg-muted/60 hover:text-areka-orange rounded-md px-3 py-2 transition"
          >
            Pourquoi nous
          </Link>
          <Link
            href="/#contact"
            onClick={close}
            className="hover:bg-muted/60 hover:text-areka-orange rounded-md px-3 py-2 transition"
          >
            Contact
          </Link>
          <Link
            href="/auth/sign-in"
            onClick={close}
            className="hover:bg-muted/60 text-foreground/70 hover:text-foreground rounded-md px-3 py-2 transition"
          >
            Espace pro
          </Link>
        </nav>
      </div>
    </header>
  );
}
