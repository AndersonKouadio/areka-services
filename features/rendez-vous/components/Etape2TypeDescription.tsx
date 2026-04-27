'use client';

import { useFormContext } from 'react-hook-form';
import { TextArea, Label, FieldError } from '@heroui/react';
import { Wrench, Flame, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TypeIntervention } from '@prisma/client';
import type { CreateRendezVousDTO } from '../schemas/rendez-vous.schema';

const OPTIONS = [
  {
    value: TypeIntervention.ENTRETIEN,
    label: 'Entretien',
    desc: 'Visite annuelle obligatoire (vérification, nettoyage).',
    icon: <Wrench size={20} />,
    tone: 'navy' as const,
  },
  {
    value: TypeIntervention.DEPANNAGE,
    label: 'Dépannage',
    desc: 'Panne, fuite, mauvais réglage.',
    icon: <Flame size={20} />,
    tone: 'orange' as const,
  },
  {
    value: TypeIntervention.PANNE_URGENTE,
    label: 'Panne urgente',
    desc: 'Plus de chauffage ou d\'eau chaude — priorité absolue.',
    icon: <AlertTriangle size={20} />,
    tone: 'raspberry' as const,
  },
];

const TONE_CLASSES = {
  navy: 'data-[selected=true]:border-areka-navy data-[selected=true]:bg-areka-navy/5',
  orange:
    'data-[selected=true]:border-areka-orange data-[selected=true]:bg-areka-orange/5',
  raspberry:
    'data-[selected=true]:border-areka-raspberry data-[selected=true]:bg-areka-raspberry/5',
};

export function Etape2TypeDescription() {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<CreateRendezVousDTO>();
  const selected = watch('type');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Type d&apos;intervention</h3>
        <p className="text-foreground/60 mt-1 text-sm">
          Choisissez la nature de votre demande.
        </p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            data-selected={selected === opt.value}
            onClick={() =>
              setValue('type', opt.value, { shouldValidate: true })
            }
            className={cn(
              'border-border/60 hover:border-foreground/30 flex w-full items-start gap-4 rounded-xl border p-4 text-left transition',
              TONE_CLASSES[opt.tone]
            )}
          >
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-lg',
                opt.tone === 'navy' && 'bg-areka-navy/10 text-areka-navy',
                opt.tone === 'orange' && 'bg-areka-orange/10 text-areka-orange',
                opt.tone === 'raspberry' &&
                  'bg-areka-raspberry/10 text-areka-raspberry'
              )}
            >
              {opt.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{opt.label}</p>
              <p className="text-foreground/60 mt-0.5 text-sm">{opt.desc}</p>
            </div>
          </button>
        ))}
        {errors.type && (
          <p className="text-areka-coral text-sm">Veuillez choisir un type.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnel)</Label>
        <TextArea
          id="description"
          {...register('description')}
          placeholder="Décrivez votre besoin (modèle de chaudière, symptômes...)."
          className="min-h-24 w-full"
        />
        {errors.description?.message && (
          <FieldError>{errors.description.message}</FieldError>
        )}
      </div>
    </div>
  );
}
