'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MapPin, Check, Loader2, AlertCircle } from 'lucide-react';
import { TextField, Input, Label, FieldError } from '@heroui/react';
import { useAdresseAutocompleteQuery } from '../queries/autocomplete-adresse.query';
import type { CreateRendezVousDTO } from '../schemas/rendez-vous.schema';
import { cn } from '@/lib/utils';

const DEBOUNCE_MS = 350;

export function AdresseAutocomplete() {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { watch, setValue, register, formState } = useFormContext<CreateRendezVousDTO>();

  const value = watch('clientAdresse') ?? '';
  const latitude = watch('latitude');
  const error = formState.errors.clientAdresse;

  const [debounced, setDebounced] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value]);

  const {
    data: suggestions = [],
    isFetching,
    isError,
    error: queryError,
  } = useAdresseAutocompleteQuery(debounced);
  const showDropdown = open && debounced.trim().length >= 3;

  // Clic en dehors → ferme le dropdown
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // Reset activeIndex quand la liste change
  useEffect(() => {
    setActiveIndex(suggestions.length > 0 ? 0 : -1);
  }, [suggestions]);

  const selectSuggestion = (idx: number) => {
    const s = suggestions[idx];
    if (!s) return;
    setValue('clientAdresse', s.label, { shouldValidate: true, shouldDirty: true });
    setValue('latitude', s.coords.lat, { shouldDirty: true });
    setValue('longitude', s.coords.lng, { shouldDirty: true });
    setValue('clientCommune', s.commune, { shouldDirty: true });
    setOpen(false);
    inputRef.current?.blur();
  };

  // Si l'utilisateur modifie l'adresse APRÈS sélection, on invalide les coords
  // ET la commune (sinon on enverrait des données qui ne correspondent plus au
  // texte saisi).
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (latitude != null) {
      setValue('latitude', null, { shouldDirty: true });
      setValue('longitude', null, { shouldDirty: true });
      setValue('clientCommune', null, { shouldDirty: true });
    }
    register('clientAdresse').onChange(e);
    setOpen(true);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(activeIndex);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const fieldRegistration = register('clientAdresse');
  const isValidated = latitude != null;

  return (
    <div ref={containerRef} className="relative">
      <TextField isRequired isInvalid={!!error}>
        <Label>Adresse complète</Label>
        <Input
          {...fieldRegistration}
          ref={(el) => {
            fieldRegistration.ref(el);
            inputRef.current = el;
          }}
          id={id}
          type="text"
          inputMode="text"
          autoComplete="street-address"
          placeholder="Commencez à taper : 12 rue de la Paix..."
          className="text-base"
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showDropdown && suggestions.length > 0}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
          }
        />
        {error?.message && <FieldError>{error.message}</FieldError>}
      </TextField>

      {/* Indicateurs d'état (loading / validated) en overlay sur l'input */}
      <div className="text-foreground/40 pointer-events-none absolute right-3 top-9 flex items-center">
        {isFetching && <Loader2 size={16} aria-hidden className="animate-spin" />}
        {!isFetching && isValidated && (
          <Check size={16} aria-hidden className="text-areka-green" />
        )}
      </div>

      {isValidated && !error && (
        <p className="text-areka-green mt-1 text-xs">Adresse géolocalisée ✓</p>
      )}

      {showDropdown && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="bg-surface border-border shadow-lg absolute left-0 right-0 z-20 mt-1 max-h-72 overflow-y-auto rounded-lg border"
        >
          {isError && (
            <li className="text-areka-coral flex items-start gap-2 px-4 py-3 text-sm">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{queryError?.message ?? 'Erreur'}</p>
                <p className="text-foreground/60 mt-0.5 text-xs">
                  Vous pouvez continuer en saisie libre — l&apos;adresse sera
                  géolocalisée plus tard.
                </p>
              </div>
            </li>
          )}
          {!isError && isFetching && suggestions.length === 0 && (
            <li className="text-foreground/50 px-4 py-3 text-sm">
              Recherche...
            </li>
          )}
          {!isError && !isFetching && suggestions.length === 0 && debounced.trim().length >= 3 && (
            <li className="text-foreground/50 px-4 py-3 text-sm">
              Aucune adresse trouvée. Vous pouvez continuer en saisie libre.
            </li>
          )}
          {suggestions.map((s, idx) => (
            <li
              key={s.id}
              id={`${id}-option-${idx}`}
              role="option"
              aria-selected={activeIndex === idx}
              onMouseDown={(e) => {
                // mousedown (avant blur) pour éviter que l'input se blur avant le click
                e.preventDefault();
                selectSuggestion(idx);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                'flex cursor-pointer items-start gap-2 px-4 py-2.5 text-sm transition',
                activeIndex === idx
                  ? 'bg-areka-orange/10 text-foreground'
                  : 'hover:bg-muted/60'
              )}
            >
              <MapPin size={14} className="text-areka-orange mt-1 shrink-0" />
              <span className="flex-1">{s.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
