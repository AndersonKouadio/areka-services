'use client';

import { useFormContext } from 'react-hook-form';
import { TextField, Input, Label, FieldError } from '@heroui/react';
import type { CreateRendezVousDTO } from '../schemas/rendez-vous.schema';
import { AdresseAutocomplete } from './AdresseAutocomplete';

export function Etape3Coordonnees() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateRendezVousDTO>();

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Vos coordonnées</h3>
        <p className="text-foreground/60 mt-1 text-sm">
          Pour vous contacter et confirmer votre rendez-vous.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField isRequired isInvalid={!!errors.clientPrenom}>
          <Label>Prénom</Label>
          <Input
            {...register('clientPrenom')}
            placeholder="Marie"
            autoComplete="given-name"
            autoCapitalize="words"
            className="text-base"
          />
          {errors.clientPrenom?.message && (
            <FieldError>{errors.clientPrenom.message}</FieldError>
          )}
        </TextField>

        <TextField isRequired isInvalid={!!errors.clientNom}>
          <Label>Nom</Label>
          <Input
            {...register('clientNom')}
            placeholder="Dupont"
            autoComplete="family-name"
            autoCapitalize="words"
            className="text-base"
          />
          {errors.clientNom?.message && (
            <FieldError>{errors.clientNom.message}</FieldError>
          )}
        </TextField>
      </div>

      <TextField isRequired isInvalid={!!errors.clientEmail}>
        <Label>Email</Label>
        <Input
          {...register('clientEmail')}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="marie.dupont@exemple.fr"
          className="text-base"
        />
        {errors.clientEmail?.message && (
          <FieldError>{errors.clientEmail.message}</FieldError>
        )}
      </TextField>

      <TextField isRequired isInvalid={!!errors.clientTelephone}>
        <Label>Téléphone</Label>
        <Input
          {...register('clientTelephone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="07 12 34 56 78"
          className="text-base"
        />
        {errors.clientTelephone?.message && (
          <FieldError>{errors.clientTelephone.message}</FieldError>
        )}
      </TextField>

      <AdresseAutocomplete />

      <TextField isInvalid={!!errors.clientAdresseComplement}>
        <Label>Complément d&apos;adresse <span className="text-foreground/50 font-normal">(optionnel)</span></Label>
        <Input
          {...register('clientAdresseComplement')}
          placeholder="Bât. A, 3e étage, code 1234B…"
          autoComplete="address-line2"
          className="text-base"
        />
        {errors.clientAdresseComplement?.message && (
          <FieldError>{errors.clientAdresseComplement.message}</FieldError>
        )}
      </TextField>
    </div>
  );
}
