import { obtenirPlanningHebdo } from '@/features/planning/actions/planning.actions';
import { obtenirToursJoursSpeciaux } from '@/features/planning/actions/jour-special.actions';
import { PlanningHebdoSection } from '@/features/planning/components/PlanningHebdoSection';
import { JoursSpeciauxList } from '@/features/planning/components/JoursSpeciauxList';

export const metadata = {
  title: 'Paramètres',
};

export default async function ParametresPage() {
  const [planning, joursSpeciaux] = await Promise.all([
    obtenirPlanningHebdo(),
    obtenirToursJoursSpeciaux(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-foreground/60 mt-1">
          Configurez votre planning hebdomadaire et les jours spéciaux
          (vacances, fériés…).
        </p>
      </header>

      <section className="space-y-10">
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Planning hebdomadaire</h2>
            <p className="text-foreground/60 text-sm">
              Activez chaque jour et configurez ses créneaux.
            </p>
          </div>
          <PlanningHebdoSection initialData={planning} />
        </div>

        <JoursSpeciauxList initialData={joursSpeciaux} />
      </section>
    </main>
  );
}
