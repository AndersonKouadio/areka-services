'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Button,
  TextField,
  Input,
  Label,
  FieldError,
  TextArea,
  Select,
  ListBox,
} from '@heroui/react';
import { Loader2, Plus, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  createRendezVousSchema,
  type CreateRendezVousDTO,
} from '../../schemas/rendez-vous.schema';
import { ajouterRendezVousManuel } from '../../actions/rendez-vous.actions';
import { TypeIntervention } from '@/features/rendez-vous/types/enums';
import { LIBELLE_TYPE } from '@/features/rendez-vous/utils/statut.utils';

const TYPES_OPTIONS = [
  { id: TypeIntervention.ENTRETIEN, label: LIBELLE_TYPE.ENTRETIEN },
  { id: TypeIntervention.DEPANNAGE, label: LIBELLE_TYPE.DEPANNAGE },
  { id: TypeIntervention.PANNE_URGENTE, label: LIBELLE_TYPE.PANNE_URGENTE },
];

export function AjouterRendezVousModal() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateRendezVousDTO>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createRendezVousSchema) as any,
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const result = await ajouterRendezVousManuel(data);
    if (!result.success) {
      setServerError(result.error ?? 'Erreur serveur');
      return;
    }
    reset();
    setOpen(false);
    router.refresh();
  });

  return (
    <>
      <Button variant="primary" onPress={() => setOpen(true)}>
        <Plus size={16} />
        Ajouter un RDV
      </Button>

      <Modal.Backdrop isOpen={open} onOpenChange={setOpen}>
        <Modal.Container>
          <Modal.Dialog className="max-w-2xl">
            <Modal.CloseTrigger />
            <form onSubmit={onSubmit}>
              <Modal.Header>
                <Modal.Heading>Ajouter un rendez-vous manuel</Modal.Heading>
                <p className="text-foreground/70 text-sm">
                  RDV pris au téléphone. Sera enregistré directement comme
                  confirmé.
                </p>
              </Modal.Header>

              <Modal.Body className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField isRequired isInvalid={!!errors.clientPrenom}>
                    <Label>Prénom</Label>
                    <Input
                      {...register('clientPrenom')}
                      autoCapitalize="words"
                    />
                    {errors.clientPrenom?.message && (
                      <FieldError>{errors.clientPrenom.message}</FieldError>
                    )}
                  </TextField>
                  <TextField isRequired isInvalid={!!errors.clientNom}>
                    <Label>Nom</Label>
                    <Input
                      {...register('clientNom')}
                      autoCapitalize="words"
                    />
                    {errors.clientNom?.message && (
                      <FieldError>{errors.clientNom.message}</FieldError>
                    )}
                  </TextField>
                </div>

                <TextField isRequired isInvalid={!!errors.clientTelephone}>
                  <Label>Téléphone</Label>
                  <Input
                    {...register('clientTelephone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                  {errors.clientTelephone?.message && (
                    <FieldError>{errors.clientTelephone.message}</FieldError>
                  )}
                </TextField>

                <TextField isRequired isInvalid={!!errors.clientEmail}>
                  <Label>Email</Label>
                  <Input
                    {...register('clientEmail')}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                  />
                  {errors.clientEmail?.message && (
                    <FieldError>{errors.clientEmail.message}</FieldError>
                  )}
                </TextField>

                <div className="space-y-1">
                  <Label htmlFor="adresse-rdv">Adresse</Label>
                  <TextArea
                    id="adresse-rdv"
                    {...register('clientAdresse')}
                    autoComplete="street-address"
                    className="min-h-16 w-full"
                  />
                  {errors.clientAdresse?.message && (
                    <FieldError>{errors.clientAdresse.message}</FieldError>
                  )}
                </div>

                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      selectedKey={field.value}
                      onSelectionChange={(k) => field.onChange(k)}
                    >
                      <Label>Type d&apos;intervention</Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {TYPES_OPTIONS.map((opt) => (
                            <ListBox.Item
                              key={opt.id}
                              id={opt.id}
                              textValue={opt.label}
                            >
                              {opt.label}
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  )}
                />
                {errors.type?.message && (
                  <FieldError>{errors.type.message}</FieldError>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField isRequired isInvalid={!!errors.dateRDV}>
                    <Label>Date</Label>
                    <Input
                      {...register('dateRDV', { valueAsDate: true })}
                      type="date"
                    />
                    {errors.dateRDV?.message && (
                      <FieldError>{errors.dateRDV.message}</FieldError>
                    )}
                  </TextField>
                  <TextField isRequired isInvalid={!!errors.creneau}>
                    <Label>Créneau</Label>
                    <Input
                      {...register('creneau')}
                      placeholder="8h30-9h30"
                    />
                    {errors.creneau?.message && (
                      <FieldError>{errors.creneau.message}</FieldError>
                    )}
                  </TextField>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="desc-rdv">Description (optionnel)</Label>
                  <TextArea
                    id="desc-rdv"
                    {...register('description')}
                    className="min-h-16 w-full"
                  />
                </div>

                {serverError && (
                  <p
                    role="alert"
                    className="bg-areka-coral/10 text-areka-coral rounded-md p-2 text-sm"
                  >
                    {serverError}
                  </p>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button slot="close" variant="tertiary">
                  <X size={14} />
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Créer le RDV
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
