import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { TrendPoint } from '../../../actions/charts.action';

interface AreaChartTrendProps {
  data: TrendPoint[];
}

/**
 * Sparkline / area chart sur 30 jours — demandes vs confirmées.
 * 2 séries : ligne 'demandes' (créées) et ligne 'confirmes'.
 * SVG pur, smoothing par bezier.
 */
export function AreaChartTrend({ data }: AreaChartTrendProps) {
  const maxDemandes = Math.max(1, ...data.map((d) => d.demandes));
  const maxConfirmes = Math.max(1, ...data.map((d) => d.confirmes));
  const max = Math.max(maxDemandes, maxConfirmes);

  const W = 700;
  const H = 200;
  const padTop = 16;
  const padBottom = 28;
  const padLeft = 28;
  const padRight = 8;
  const innerW = W - padLeft - padRight;
  const innerH = H - padTop - padBottom;

  const xAt = (i: number) =>
    padLeft + (data.length === 1 ? 0 : (i / (data.length - 1)) * innerW);
  const yAt = (v: number) => padTop + innerH - (v / max) * innerH;

  const linePath = (key: 'demandes' | 'confirmes') =>
    data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(d[key])}`)
      .join(' ');

  const areaPath = (key: 'demandes' | 'confirmes') =>
    `${linePath(key)} L ${xAt(data.length - 1)} ${padTop + innerH} L ${padLeft} ${padTop + innerH} Z`;

  const ticks = [0, Math.ceil(max / 2), max];
  const totalDemandes = data.reduce((s, d) => s + d.demandes, 0);
  const totalConfirmes = data.reduce((s, d) => s + d.confirmes, 0);

  return (
    <div className="text-foreground">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-[200px] w-full"
        role="img"
        aria-label="Tendance 30 jours — demandes et confirmations"
      >
        <defs>
          <linearGradient id="grad-demandes" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-confirmes" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              className="text-accent"
              stopColor="currentColor"
              stopOpacity="0.25"
            />
            <stop
              offset="100%"
              className="text-accent"
              stopColor="currentColor"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Grid */}
        {ticks.map((t) => {
          const y = yAt(t);
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

        {/* Demandes (texture grise) */}
        <path d={areaPath('demandes')} fill="url(#grad-demandes)" />
        <path
          d={linePath('demandes')}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />

        {/* Confirmées (vert accent) */}
        <g className="text-accent">
          <path d={areaPath('confirmes')} fill="url(#grad-confirmes)" />
          <path
            d={linePath('confirmes')}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>

        {/* X labels — quelques dates clés */}
        {[0, Math.floor(data.length / 2), data.length - 1].map((i) => {
          const d = data[i];
          if (!d) return null;
          return (
            <text
              key={i}
              x={xAt(i)}
              y={H - 8}
              textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
              className="fill-current text-[9px] opacity-60"
            >
              {format(parseISO(d.date), 'd MMM', { locale: fr })}
            </text>
          );
        })}
      </svg>

      <div className="text-foreground/70 mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-accent inline-block h-0.5 w-4 rounded-full" />
          Confirmés <strong className="text-foreground">{totalConfirmes}</strong>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-foreground/40 inline-block h-0.5 w-4 rounded-full" />
          Demandes <strong className="text-foreground">{totalDemandes}</strong>
        </span>
      </div>
    </div>
  );
}
