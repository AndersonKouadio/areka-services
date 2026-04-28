'use client';

import { Search, X } from 'lucide-react';
import { Input, SearchField, Select, ListBox, Label } from '@heroui/react';
import { useRendezVousFilters } from '../../filters/rendez-vous.filters';
import { LIBELLE_STATUT, LIBELLE_TYPE } from '../../utils/statut.utils';
import { StatutRDV, TypeIntervention } from '@/features/rendez-vous/types/enums';

export function FiltresRendezVous() {
  const [filters, setFilters] = useRendezVousFilters();

  const reset = () =>
    setFilters({
      page: 1,
      limit: 20,
      search: '',
      statut: null,
      type: null,
      source: null,
      dateDebut: null,
      dateFin: null,
      sortBy: 'dateRDV',
      sortOrder: 'desc',
    });

  const hasFilters =
    !!filters.search || !!filters.statut || !!filters.type;

  return (
    <div className="bg-card border-border/50 flex flex-wrap items-center gap-3 rounded-xl border p-4">
      <SearchField
        value={filters.search}
        onChange={(v) => setFilters({ search: v, page: 1 })}
        className="min-w-64 flex-1"
      >
        <Input placeholder="Rechercher (nom, email, référence...)" />
      </SearchField>

      <Select
        selectedKey={filters.statut ?? 'all'}
        onSelectionChange={(key) =>
          setFilters({
            statut: key === 'all' ? null : (key as StatutRDV),
            page: 1,
          })
        }
        className="w-44"
      >
        <Label className="sr-only">Statut</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="all" textValue="Tous">
              Tous les statuts
            </ListBox.Item>
            {Object.values(StatutRDV).map((s) => (
              <ListBox.Item key={s} id={s} textValue={LIBELLE_STATUT[s]}>
                {LIBELLE_STATUT[s]}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        selectedKey={filters.type ?? 'all'}
        onSelectionChange={(key) =>
          setFilters({
            type: key === 'all' ? null : (key as TypeIntervention),
            page: 1,
          })
        }
        className="w-44"
      >
        <Label className="sr-only">Type</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="all" textValue="Tous">
              Tous les types
            </ListBox.Item>
            {Object.values(TypeIntervention).map((t) => (
              <ListBox.Item key={t} id={t} textValue={LIBELLE_TYPE[t]}>
                {LIBELLE_TYPE[t]}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {hasFilters && (
        <button
          type="button"
          onClick={reset}
          className="text-foreground/60 hover:text-foreground inline-flex items-center gap-1 text-sm transition"
        >
          <X size={14} />
          Réinitialiser
        </button>
      )}
    </div>
  );
}
