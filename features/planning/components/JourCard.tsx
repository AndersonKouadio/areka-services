'use client';

import { useState } from 'react';
import { Switch, Button } from '@heroui/react';
import { Save, Loader2, Check } from 'lucide-react';
import { CreneauInput } from './CreneauInput';
import { useModifierPlanningJourMutation } from '../queries/planning-update.mutation';
import { LIBELLES_JOURS } from '../types/planning.type';
import type { Planning } from '@prisma/client';

interface Props {
  planning: Planning;
}

export function JourCard({ planning }: Props) {
  const [actif, setActif] = useState(planning.actif);
  const [creneaux, setCreneaux] = useState<string[]>(planning.creneaux);
  const [saved, setSaved] = useState(false);
  const { mutateAsync, isPending } = useModifierPlanningJourMutation();

  const isDirty =
    actif !== planning.actif ||
    JSON.stringify(creneaux) !== JSON.stringify(planning.creneaux);

  const handleSave = async () => {
    const result = await mutateAsync({
      jourSemaine: planning.jourSemaine,
      actif,
      creneaux,
    });
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="bg-card border-border/50 rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{LIBELLES_JOURS[planning.jourSemaine]}</p>
          <p className="text-foreground/50 text-xs">
            {actif ? `${creneaux.length} créneau(x)` : 'Fermé'}
          </p>
        </div>
        <Switch isSelected={actif} onChange={setActif}>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
      </div>

      {actif && (
        <CreneauInput
          creneaux={creneaux}
          onChange={setCreneaux}
        />
      )}

      {isDirty && (
        <div className="border-border/40 mt-3 flex justify-end border-t pt-3">
          <Button
            type="button"
            variant="primary"
            onPress={handleSave}
            isDisabled={isPending}
            className="text-xs"
          >
            {isPending ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Enregistrement
              </>
            ) : (
              <>
                <Save size={12} />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      )}

      {saved && (
        <p className="text-areka-green mt-2 inline-flex items-center gap-1 text-xs">
          <Check size={12} />
          Sauvegardé
        </p>
      )}
    </div>
  );
}
