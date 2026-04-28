'use client';

import { useState } from 'react';
import { Plus, X, Sun, Sunset } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  formaterCreneau,
  validerCreneau,
  detecterChevauchement,
  grouperCreneauxMatinAprem,
  comparerCreneaux,
} from '../utils/planning.utils';

interface Props {
  creneaux: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

/**
 * Composant pour gérer une liste de créneaux : afficher + ajouter + supprimer.
 * Format attendu : "8h30-9h30" (regex validée + start<end + non-chevauchement).
 * Affiche les créneaux en deux sections : Matin / Après-midi.
 */
export function CreneauInput({ creneaux, onChange, disabled }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const ajouter = () => {
    const value = input.trim();
    const formatErr = validerCreneau(value);
    if (formatErr) {
      setError(formatErr);
      return;
    }
    if (creneaux.includes(value)) {
      setError('Créneau déjà ajouté.');
      return;
    }
    const overlap = detecterChevauchement([...creneaux, value]);
    if (overlap) {
      setError('Ce créneau chevauche un créneau existant.');
      return;
    }
    onChange([...creneaux, value].sort(comparerCreneaux));
    setInput('');
    setError(null);
  };

  const retirer = (c: string) => {
    onChange(creneaux.filter((x) => x !== c));
  };

  const { matin, aprem } = grouperCreneauxMatinAprem(creneaux);

  const renderGroupe = (
    label: string,
    Icon: typeof Sun,
    items: string[]
  ) =>
    items.length === 0 ? null : (
      <div>
        <p className="text-foreground/60 mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
          <Icon size={10} />
          {label}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {items.map((c) => (
            <span
              key={c}
              className={cn(
                'border-border/60 bg-muted/40 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs',
                disabled && 'opacity-50'
              )}
            >
              {formaterCreneau(c)}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => retirer(c)}
                  aria-label={`Retirer ${c}`}
                  className="hover:text-areka-coral"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-3">
      {creneaux.length === 0 ? (
        <p className="text-foreground/60 text-xs italic">Aucun créneau</p>
      ) : (
        <>
          {renderGroupe('Matin', Sun, matin)}
          {renderGroupe('Après-midi', Sunset, aprem)}
        </>
      )}

      {!disabled && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                ajouter();
              }
            }}
            placeholder="Ex : 8h30-9h30"
            inputMode="text"
            aria-invalid={!!error}
            aria-describedby={error ? 'creneau-input-error' : undefined}
            className="border-border/60 focus:border-areka-orange focus:ring-areka-orange/20 w-32 rounded-md border bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2"
          />
          <button
            type="button"
            onClick={ajouter}
            className="border-border/60 hover:border-areka-orange hover:bg-areka-orange/5 hover:text-areka-orange inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition"
          >
            <Plus size={12} />
            Ajouter
          </button>
        </div>
      )}
      {error && (
        <p id="creneau-input-error" role="alert" className="text-areka-coral text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
