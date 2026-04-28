import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Areka Services — Chauffagiste',
    short_name: 'Areka',
    description:
      'Gestion des rendez-vous chauffage à Cholet et alentours. Espace pro pour artisan chauffagiste.',
    start_url: '/admin',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FAF7F2',
    theme_color: '#1E3A5F',
    lang: 'fr',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icone.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icone.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icone.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Rendez-vous',
        short_name: 'RDV',
        description: 'Voir les rendez-vous',
        url: '/admin/rendez-vous',
      },
      {
        name: 'Tournée du jour',
        short_name: 'Tournée',
        description: 'Itinéraire du jour',
        url: '/admin/tournee',
      },
    ],
  };
}
