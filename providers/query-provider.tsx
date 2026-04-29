'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Données considérées fraîches 1 min — pas de refetch silencieux pendant ce délai.
        staleTime: 60 * 1000,
        // Cache conservé 10 min en mémoire après la dernière utilisation.
        // Permet une nav arrière/avant instantanée.
        gcTime: 10 * 60 * 1000,
        // Désactivé : un artisan qui passe sur Slack ne veut pas voir l'UI
        // re-trembler à chaque retour. Les mutations invalident déjà via
        // useInvalidateRendezVousQuery — pas besoin de refetch défensif.
        refetchOnWindowFocus: false,
        // Reconnexion réseau : on garde le refetch (cas typique mobile en zone blanche).
        refetchOnReconnect: true,
        retry: (count, error) => {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;
          if (status === 404) return false;
          return count < 2;
        },
      },
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
