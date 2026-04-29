import { redirect } from 'next/navigation';

/**
 * Ancienne URL conservée pour les QR codes déjà imprimés.
 * Redirige vers la nouvelle page d'accueil (qui héberge le formulaire).
 */
export default function RendezVousPage() {
  redirect('/');
}
