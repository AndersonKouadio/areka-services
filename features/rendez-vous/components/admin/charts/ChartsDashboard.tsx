import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { LIBELLE_TYPE, LIBELLE_STATUT } from '../../../utils/statut.utils';
import { ChartCard } from './ChartCard';
import { BarChartDaily } from './BarChartDaily';
import { DonutChart } from './DonutChart';
import { AreaChartTrend } from './AreaChartTrend';
import type { ChartsData } from '../../../actions/charts.action';

interface Props {
  data: ChartsData;
}

const TYPE_FILL: Record<string, { fill: string; swatch: string }> = {
  ENTRETIEN: { fill: 'fill-areka-navy', swatch: 'bg-areka-navy' },
  DEPANNAGE: { fill: 'fill-areka-orange', swatch: 'bg-areka-orange' },
  PANNE_URGENTE: { fill: 'fill-areka-raspberry', swatch: 'bg-areka-raspberry' },
};

const STATUT_FILL: Record<string, { fill: string; swatch: string }> = {
  EN_ATTENTE: { fill: 'fill-areka-amber', swatch: 'bg-areka-amber' },
  CONFIRME: { fill: 'fill-accent', swatch: 'bg-accent' },
  REFUSE: { fill: 'fill-areka-coral', swatch: 'bg-areka-coral' },
  PROPOSE_AUTRE_DATE: { fill: 'fill-areka-orange', swatch: 'bg-areka-orange' },
  TERMINE: { fill: 'fill-areka-navy', swatch: 'bg-areka-navy' },
  ANNULE: { fill: 'fill-foreground/20', swatch: 'bg-foreground/30' },
};

export function ChartsDashboard({ data }: Props) {
  const typeSlices = data.parType.map((it) => ({
    key: it.key,
    label: LIBELLE_TYPE[it.key],
    value: it.count,
    fillClass: TYPE_FILL[it.key]?.fill ?? 'fill-foreground/20',
    swatchClass: TYPE_FILL[it.key]?.swatch ?? 'bg-foreground/30',
  }));

  const statutSlices = data.parStatut
    .filter((it) => it.count > 0)
    .map((it) => ({
      key: it.key,
      label: LIBELLE_STATUT[it.key],
      value: it.count,
      fillClass: STATUT_FILL[it.key]?.fill ?? 'fill-foreground/20',
      swatchClass: STATUT_FILL[it.key]?.swatch ?? 'bg-foreground/30',
    }));

  const totalType = data.parType.reduce((s, x) => s + x.count, 0);
  const totalStatut = data.parStatut.reduce((s, x) => s + x.count, 0);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Statistiques</h2>
          <p className="text-foreground/60 text-sm">
            Vue d&apos;ensemble des 30 derniers jours.
          </p>
        </div>
      </header>

      {/* Ligne 1 : graphiques larges */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Planning 14 jours"
          description="7 jours passés + 7 jours à venir"
          badge={
            <span className="bg-accent/15 text-accent inline-flex size-8 items-center justify-center rounded-lg">
              <BarChart3 size={16} />
            </span>
          }
        >
          <BarChartDaily data={data.parJour14j} />
        </ChartCard>

        <ChartCard
          title="Tendance 30 jours"
          description="Demandes reçues vs RDV confirmés"
          badge={
            <span className="bg-accent/15 text-accent inline-flex size-8 items-center justify-center rounded-lg">
              <TrendingUp size={16} />
            </span>
          }
        >
          <AreaChartTrend data={data.tendance30j} />
        </ChartCard>
      </div>

      {/* Ligne 2 : donuts répartition */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Par type d'intervention"
          description="Répartition sur 30 jours"
          badge={
            <span className="bg-areka-orange/15 text-areka-orange inline-flex size-8 items-center justify-center rounded-lg">
              <PieChart size={16} />
            </span>
          }
        >
          <DonutChart
            slices={typeSlices}
            centerValue={String(totalType)}
            centerLabel="Total"
          />
        </ChartCard>

        <ChartCard
          title="Par statut"
          description="État actuel des demandes"
          badge={
            <span className="bg-areka-amber/15 text-areka-amber inline-flex size-8 items-center justify-center rounded-lg">
              <Activity size={16} />
            </span>
          }
        >
          <DonutChart
            slices={statutSlices}
            centerValue={String(totalStatut)}
            centerLabel="Total"
          />
        </ChartCard>
      </div>
    </section>
  );
}
