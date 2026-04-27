import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SignInForm } from '@/features/auth/components/SignInForm';

export const metadata = {
  title: 'Connexion espace pro',
};

export default function SignInPage() {
  return (
    <main className="from-areka-cream to-background flex min-h-screen flex-col items-center justify-center bg-linear-to-b px-6 py-12">
      <Link
        href="/"
        className="text-foreground/60 hover:text-foreground absolute left-6 top-6 inline-flex items-center gap-1 text-sm transition"
      >
        <ArrowLeft size={14} />
        Retour
      </Link>

      <div className="mb-8">
        <Image src="/logo.png" alt="Areka Services" width={140} height={94} priority />
      </div>

      <div className="bg-card border-border/50 w-full max-w-md rounded-2xl border p-8 shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Espace pro</h1>
          <p className="text-foreground/60 mt-1 text-sm">
            Connectez-vous pour accéder au planning et aux demandes.
          </p>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}
