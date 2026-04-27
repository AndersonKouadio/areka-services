'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { CalendarPlus, Trash2, Loader2 } from 'lucide-react';
import { AjouterJourSpecialModal } from './AjouterJourSpecialModal';
import { useJoursSpeciauxListQuery } from '../queries/jour-special-list.query';
import { useSupprimerJourSpecialMutation } from '../queries/jour-special-mutations';
import { formaterCreneau } from '../utils/planning.utils';
import type { JourSpecial } from '@prisma/client';

interface Props {
  initialData: JourSpecial[];
}

export function JoursSpeciauxList({ initialData }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const { data } = useJoursSpeciauxListQuery();
  const list = data ?? initialData;

  return (
    <>
      <div className="bg-card border-border/50 overflow-hidden rounded-xl border">
        <div className="border-border/50 flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-base font-semibold">Jours spéciaux</h3>
            <p className="text-foreground/60 text-xs">
              Vacances, jours fériés, ouvertures exceptionnelles
            </p>
          </div>
          <Button variant="primary" onPress={() => setOpenModal(true)}>
            <CalendarPlus size={16} />
            Ajouter
          </Button>
        </div>

        {list.length === 0 ? (
          <p className="text-foreground/50 px-5 py-8 text-center text-sm">
            Aucun jour spécial configuré.
          </p>
        ) : (
          <ul className="divide-border/40 divide-y">
            {list.map((j) => (
              <JourSpecialRow key={j.id} jour={j} />
            ))}
          </ul>
        )}
      </div>

      <AjouterJourSpecialModal
        isOpen={openModal}
        onOpenChange={setOpenModal}
      />
    </>
  );
}

function JourSpecialRow({ jour }: { jour: JourSpecial }) {
  const { mutateAsync, isPending } = useSupprimerJourSpecialMutation();

  const handleDelete = async () => {
    if (!confirm('Supprimer ce jour spécial ?')) return;
    await mutateAsync(jour.id);
  };

  return (
    <li className="flex flex-wrap items-center gap-3 px-5 py-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium">
          {new Date(jour.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className="text-foreground/60 mt-0.5 text-xs">
          {jour.actif
            ? `Ouvert · ${jour.creneaux.length} créneau(x)`
            : 'Fermé'}
          {jour.motif && ` · ${jour.motif}`}
        </p>
        {jour.actif && jour.creneaux.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {jour.creneaux.map((c) => (
              <span
                key={c}
                className="bg-muted/50 rounded px-1.5 py-0.5 text-xs"
              >
                {formaterCreneau(c)}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Supprimer"
        className="text-foreground/50 hover:text-areka-coral hover:bg-areka-coral/10 inline-flex size-8 items-center justify-center rounded-lg transition disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </li>
  );
}
