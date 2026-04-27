'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card } from '@heroui/react';
import { ArrowLeft, ArrowRight, Loader2, Send } from 'lucide-react';
import {
  createRendezVousSchema,
  type CreateRendezVousDTO,
} from '../schemas/rendez-vous.schema';
import { useAjouterRendezVousMutation } from '../queries/rendez-vous-add.mutation';
import { InfoAreka } from './InfoAreka';
import { Stepper } from './Stepper';
import { Etape1DateCreneau } from './Etape1DateCreneau';
import { Etape2TypeDescription } from './Etape2TypeDescription';
import { Etape3Coordonnees } from './Etape3Coordonnees';
import { Etape4Recapitulatif } from './Etape4Recapitulatif';
import { SuccessRendezVous } from './SuccessRendezVous';

const STEPS = [
  { label: 'Date & créneau' },
  { label: 'Intervention' },
  { label: 'Coordonnées' },
  { label: 'Confirmation' },
];

const FIELDS_PER_STEP: Record<number, (keyof CreateRendezVousDTO)[]> = {
  1: ['dateRDV', 'creneau'],
  2: ['type'],
  3: ['clientNom', 'clientPrenom', 'clientEmail', 'clientTelephone', 'clientAdresse'],
  4: [],
};

export function FormulaireRendezVous() {
  const [step, setStep] = useState(1);
  const [reference, setReference] = useState<string | null>(null);

  const methods = useForm<CreateRendezVousDTO>({
    resolver: zodResolver(createRendezVousSchema),
    mode: 'onChange',
    defaultValues: { description: '' },
  });

  const { mutateAsync, isPending } = useAjouterRendezVousMutation();

  const next = async () => {
    const ok = await methods.trigger(FIELDS_PER_STEP[step]);
    if (ok) setStep(step + 1);
  };

  const submit = methods.handleSubmit(async (data) => {
    const result = await mutateAsync(data);
    if (result.success && result.data) {
      setReference(result.data.reference);
    } else {
      methods.setError('root', { message: result.error ?? 'Erreur inattendue' });
    }
  });

  if (reference) {
    return (
      <Card className="border-border/50 mx-auto max-w-2xl border p-8">
        <SuccessRendezVous reference={reference} />
      </Card>
    );
  }

  return (
    <FormProvider {...methods}>
      <Card className="border-border/50 flex w-full flex-col-reverse border md:grid md:grid-cols-[260px_1fr] md:divide-x lg:grid-cols-[320px_1fr]">
        <aside className="bg-muted/30 p-4 sm:p-6 md:p-8">
          <InfoAreka />
        </aside>

        <form onSubmit={submit} className="flex flex-col p-4 sm:p-6 md:p-8">
          <Stepper current={step} steps={STEPS} />

          <div className="mt-8 min-h-[480px] flex-1">
            {step === 1 && <Etape1DateCreneau />}
            {step === 2 && <Etape2TypeDescription />}
            {step === 3 && <Etape3Coordonnees />}
            {step === 4 && <Etape4Recapitulatif />}
          </div>

          {methods.formState.errors.root?.message && (
            <p className="text-areka-coral mt-4 text-sm">
              {methods.formState.errors.root.message}
            </p>
          )}

          <div className="border-border/40 mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between border-t pt-6">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onPress={() => setStep(step - 1)}
                className="w-full sm:w-auto"
              >
                <ArrowLeft size={16} />
                Retour
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                type="button"
                variant="primary"
                onPress={next}
                className="w-full sm:w-auto"
              >
                Continuer
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                isDisabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Confirmer la demande
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </FormProvider>
  );
}
