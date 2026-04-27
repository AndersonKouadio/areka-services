'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  estFormatCreneauValide,
  formaterCreneau,
} from '../utils/planning.utils';

interface Props {
  creneaux: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

/**
 * Composant pour gérer une liste de créneaux : afficher + ajouter + supprimer.
 * Format attendu : "8h30-9h30" (regex validée).
 */
export function CreneauInput({ creneaux, onChange, disabled }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const ajouter = () => {
    const value = input.trim();
    if (!estFormatCreneauValide(value)) {
      setError('Format attendu : 8h30-9h30');
      return;
    }
    if (creneaux.includes(value)) {
      setError('Créneau déjà ajouté.');
      return;
    }
    onChange([...creneaux, value]);
    setInput('');
    setError(null);
  };

  const retirer = (c: string) => {
    onChange(creneaux.filter((x) => x !== c));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {creneaux.length === 0 && (
          <p className="text-foreground/50 text-xs italic">Aucun créneau</p>
        )}
        {creneaux.map((c) => (
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
      {error && <p className="text-areka-coral text-xs">{error}</p>}
    </div>
  );
}
