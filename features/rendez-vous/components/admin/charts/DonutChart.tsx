interface DonutSlice {
  key: string;
  label: string;
  value: number;
  /** Tailwind class fill (ex 'fill-accent', 'fill-areka-orange') */
  fillClass: string;
  /** Tailwind class swatch équivalent pour la légende (ex 'bg-accent') */
  swatchClass: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  /** Texte centré dans le donut (chiffre principal) */
  centerValue?: string;
  /** Sous-texte centré (label sous le chiffre) */
  centerLabel?: string;
}

/**
 * Donut chart SVG pur — chaque slice a un arc calculé en polar coords.
 * Affiche une légende verticale à droite (desktop) ou en dessous (mobile).
 */
export function DonutChart({
  slices,
  centerValue,
  centerLabel,
}: DonutChartProps) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const W = 200;
  const H = 200;
  const cx = W / 2;
  const cy = H / 2;
  const r = 78;
  const ir = 52;

  let acc = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative shrink-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-[180px] w-[180px]"
          role="img"
          aria-label="Répartition"
        >
          {total === 0 && (
            // Cercle gris si pas de données
            <g>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                className="fill-muted"
              />
              <circle cx={cx} cy={cy} r={ir} className="fill-card" />
            </g>
          )}
          {total > 0 &&
            slices.map((s) => {
              if (s.value === 0) return null;
              const start = (acc / total) * Math.PI * 2;
              const end = ((acc + s.value) / total) * Math.PI * 2;
              acc += s.value;
              const path = arcPath(cx, cy, r, ir, start, end);
              return (
                <path
                  key={s.key}
                  d={path}
                  className={s.fillClass}
                >
                  <title>
                    {s.label} : {s.value} ({Math.round((s.value / total) * 100)}%)
                  </title>
                </path>
              );
            })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue && (
              <span className="text-foreground text-2xl font-bold tabular-nums">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-foreground/60 mt-0.5 text-[10px] uppercase tracking-wider">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      <ul className="flex w-full flex-col gap-2 text-sm sm:w-auto sm:min-w-[140px]">
        {slices.map((s) => {
          const pct = total === 0 ? 0 : Math.round((s.value / total) * 100);
          return (
            <li
              key={s.key}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-foreground/80 inline-flex items-center gap-2">
                <span
                  className={'inline-block size-2.5 rounded-sm ' + s.swatchClass}
                />
                {s.label}
              </span>
              <span className="text-foreground tabular-nums text-xs font-medium">
                {s.value}
                <span className="text-foreground/50"> · {pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Calcule un path SVG d'arc d'anneau (donut slice).
 * Coordonnées polaires : 0 = haut (12h), sens horaire.
 */
function arcPath(
  cx: number,
  cy: number,
  r: number,
  ir: number,
  startAngle: number,
  endAngle: number
): string {
  // Rotation -90° pour démarrer en haut
  const a0 = startAngle - Math.PI / 2;
  const a1 = endAngle - Math.PI / 2;
  const x1 = cx + r * Math.cos(a0);
  const y1 = cy + r * Math.sin(a0);
  const x2 = cx + r * Math.cos(a1);
  const y2 = cy + r * Math.sin(a1);
  const xi1 = cx + ir * Math.cos(a1);
  const yi1 = cy + ir * Math.sin(a1);
  const xi2 = cx + ir * Math.cos(a0);
  const yi2 = cy + ir * Math.sin(a0);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${x1} ${y1}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${xi1} ${yi1}`,
    `A ${ir} ${ir} 0 ${largeArc} 0 ${xi2} ${yi2}`,
    'Z',
  ].join(' ');
}
