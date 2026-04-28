import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DailyPoint } from '../../../actions/charts.action';

interface BarChartDailyProps {
  data: DailyPoint[];
}

/**
 * Bar chart stacké par jour (14 derniers jours).
 * Chaque colonne = total RDV ce jour-là, segmenté en confirmé / en attente / refusé.
 *
 * SVG pur, responsive via viewBox + preserveAspectRatio.
 * Hauteur fixe en CSS, largeur fluid.
 */
export function BarChartDaily({ data }: BarChartDailyProps) {
  const max = Math.max(1, ...data.map((d) => d.total));
  const W = 700; // viewBox width
  const H = 220; // viewBox height
  const padTop = 16;
  const padBottom = 36;
  const padLeft = 28;
  const padRight = 8;
  const innerW = W - padLeft - padRight;
  const innerH = H - padTop - padBottom;
  const barGap = 4;
  const barW = (innerW - barGap * (data.length - 1)) / data.length;

  // Lignes guides horizontales (max, mid)
  const ticks = [0, Math.ceil(max / 2), max];

  return (
    <div className="text-foreground">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-[220px] w-full"
        role="img"
        aria-label="Rendez-vous par jour, 14 derniers jours"
      >
        {/* Grid lines */}
        {ticks.map((t) => {
          const y = padTop + innerH - (t / max) * innerH;
          return (
            <g key={t}>
              <line
                x1={padLeft}
                x2={W - padRight}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-current text-[9px] opacity-50"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padLeft + i * (barW + barGap);
          const yBase = padTop + innerH;
          // Stack : refuse en bas, en attente milieu, confirmé en haut
          const hRefuse = (d.refuse / max) * innerH;
          const hAttente = (d.enAttente / max) * innerH;
          const hConfirme = (d.confirme / max) * innerH;
          const yRefuse = yBase - hRefuse;
          const yAttente = yRefuse - hAttente;
          const yConfirme = yAttente - hConfirme;

          const date = parseISO(d.date);
          const dayLabel = format(date, 'EEE d', { locale: fr });
          const isToday = d.date === format(new Date(), 'yyyy-MM-dd');

          return (
            <g key={d.date}>
              <title>
                {format(date, 'EEEE d MMMM', { locale: fr })} · {d.total} RDV
                {d.confirme ? ` (${d.confirme} confirmé)` : ''}
                {d.enAttente ? ` (${d.enAttente} en attente)` : ''}
                {d.refuse ? ` (${d.refuse} refusé)` : ''}
              </title>
              {hConfirme > 0 && (
                <rect
                  x={x}
                  y={yConfirme}
                  width={barW}
                  height={hConfirme}
                  rx="2"
                  className="fill-accent"
                />
              )}
              {hAttente > 0 && (
                <rect
                  x={x}
                  y={yAttente}
                  width={barW}
                  height={hAttente}
                  className="fill-areka-amber"
                />
              )}
              {hRefuse > 0 && (
                <rect
                  x={x}
                  y={yRefuse}
                  width={barW}
                  height={hRefuse}
                  rx="2"
                  className="fill-areka-coral/70"
                />
              )}
              {/* Empty bar guide if 0 */}
              {d.total === 0 && (
                <rect
                  x={x}
                  y={yBase - 1}
                  width={barW}
                  height="2"
                  rx="1"
                  className="fill-current opacity-15"
                />
              )}
              {/* Label X */}
              <text
                x={x + barW / 2}
                y={H - 16}
                textAnchor="middle"
                className={
                  'fill-current text-[9px] ' +
                  (isToday ? 'font-bold opacity-100' : 'opacity-60')
                }
              >
                {dayLabel.split(' ')[0].slice(0, 3)}
              </text>
              <text
                x={x + barW / 2}
                y={H - 4}
                textAnchor="middle"
                className={
                  'fill-current text-[9px] tabular-nums ' +
                  (isToday ? 'font-bold opacity-100' : 'opacity-50')
                }
              >
                {dayLabel.split(' ')[1]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Légende */}
      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <LegendItem swatch="bg-accent" label="Confirmé" />
        <LegendItem swatch="bg-areka-amber" label="En attente" />
        <LegendItem swatch="bg-areka-coral/70" label="Refusé/Annulé" />
      </ul>
    </div>
  );
}

function LegendItem({ swatch, label }: { swatch: string; label: string }) {
  return (
    <li className="text-foreground/70 inline-flex items-center gap-1.5">
      <span className={'inline-block size-2.5 rounded-sm ' + swatch} />
      {label}
    </li>
  );
}
