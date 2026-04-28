'use client';

import { Sun, Sunset, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupeProps {
  label: 'Matin' | 'Après-midi';
  creneaux: string[];
  selected: string | undefined;
  onSelect: (c: string) => void;
}

/**
 * Groupe Matin / Après-midi de créneaux sous forme de pills.
 * Réutilisé par le formulaire client (Etape1) et par la modale
 * admin (ProposerDateModal). Format pill : "8h30 — 9h30".
 */
export function CreneauxGroupe({
  label,
  creneaux,
  selected,
  onSelect,
}: GroupeProps) {
  const Icon = label === 'Matin' ? Sun : Sunset;
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            'inline-flex size-6 items-center justify-center rounded-full',
            label === 'Matin' ? 'bg-areka-amber/15' : 'bg-areka-orange/15'
          )}
        >
          <Icon
            size={13}
            className={
              label === 'Matin' ? 'text-areka-amber' : 'text-areka-orange'
            }
          />
        </span>
        <p className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">
          {label}
        </p>
        <span className="text-foreground/50 text-xs">
          · {creneaux.length} dispo{creneaux.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {creneaux.map((c) => {
          const [debut, fin] = c.split('-');
          const isActive = selected === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onSelect(c)}
              aria-pressed={isActive}
              aria-label={`Créneau de ${debut} à ${fin}`}
              className={cn(
                'group flex h-12 min-w-[110px] flex-1 basis-[120px] items-center justify-center gap-2 rounded-xl border-2 px-3 transition-all duration-150',
                isActive
                  ? 'border-accent bg-accent text-accent-foreground shadow-md'
                  : 'border-border bg-surface text-foreground hover:border-accent/50 hover:bg-accent/10 hover:shadow-sm active:scale-[0.98]'
              )}
            >
              <span className="flex items-baseline gap-1 tabular-nums">
                <span className="text-sm font-semibold">{debut}</span>
                <span
                  className={cn(
                    'text-xs',
                    isActive ? 'text-accent-foreground/60' : 'text-foreground/40'
                  )}
                  aria-hidden="true"
                >
                  —
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isActive ? 'text-accent-foreground' : 'text-foreground'
                  )}
                >
                  {fin}
                </span>
              </span>
              {isActive && (
                <Check
                  size={14}
                  strokeWidth={3}
                  aria-hidden="true"
                  className="shrink-0"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CreneauxSectionProps {
  matin: string[];
  apresMidi: string[];
  selected: string | undefined;
  onSelect: (c: string) => void;
}

/**
 * Section qui rend les deux groupes Matin / Après-midi.
 */
export function CreneauxSection({
  matin,
  apresMidi,
  selected,
  onSelect,
}: CreneauxSectionProps) {
  return (
    <div className="space-y-5">
      {matin.length > 0 && (
        <CreneauxGroupe
          label="Matin"
          creneaux={matin}
          selected={selected}
          onSelect={onSelect}
        />
      )}
      {apresMidi.length > 0 && (
        <CreneauxGroupe
          label="Après-midi"
          creneaux={apresMidi}
          selected={selected}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
