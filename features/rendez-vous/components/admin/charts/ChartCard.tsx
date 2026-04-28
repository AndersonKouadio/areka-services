import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
  /**
   * Hauteur min du contenu (le chart). Sur mobile/desktop pareil ;
   * le SVG s'adapte via aspect-ratio interne.
   */
  contentClassName?: string;
}

/**
 * Container de chart : header avec titre + description + badge,
 * card surface bg, padding consistant.
 */
export function ChartCard({
  title,
  description,
  badge,
  children,
  contentClassName,
}: ChartCardProps) {
  return (
    <div className="bg-card border-border/60 flex flex-col rounded-2xl border p-5 shadow-xs">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-foreground text-sm font-semibold">{title}</h3>
          {description && (
            <p className="text-foreground/60 mt-0.5 text-xs">{description}</p>
          )}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      <div className={contentClassName ?? 'flex-1'}>{children}</div>
    </div>
  );
}
