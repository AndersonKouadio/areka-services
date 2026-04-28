import { cn } from '@/lib/utils';

interface StepperProps {
  current: number;
  steps: { label: string }[];
}

export function Stepper({ current, steps }: StepperProps) {
  return (
    <ol
      role="list"
      aria-label={`Étape ${current} sur ${steps.length}`}
      className="flex items-center gap-2"
    >
      {steps.map((step, i) => {
        const num = i + 1;
        const isActive = num === current;
        const isDone = num < current;
        const status = isDone ? 'terminée' : isActive ? 'en cours' : 'à venir';
        return (
          <li
            key={step.label}
            className="flex flex-1 items-center gap-2"
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Étape ${num} : ${step.label} (${status})`}
          >
            <div
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition',
                isActive && 'bg-areka-orange text-white shadow-md',
                isDone && 'bg-areka-green text-white',
                !isActive && !isDone && 'bg-muted text-foreground/70'
              )}
              aria-hidden="true"
            >
              {isDone ? '✓' : num}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1 rounded-full transition',
                  isDone ? 'bg-areka-green' : 'bg-muted'
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
