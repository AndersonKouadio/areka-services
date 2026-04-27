import { Wrench, Flame, AlertTriangle } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Nos services
        </h2>
        <p className="text-foreground/70 mx-auto mt-3 max-w-xl">
          Trois interventions principales, prises en charge rapidement.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <ServiceCard
          icon={<Wrench size={24} />}
          title="Entretien"
          desc="Visite annuelle obligatoire. Vérification, nettoyage, contrôles de sécurité conformes."
          tone="navy"
        />
        <ServiceCard
          icon={<Flame size={24} />}
          title="Dépannage"
          desc="Panne, fuite, mauvais réglage. Intervention rapide pour rétablir votre confort."
          tone="orange"
        />
        <ServiceCard
          icon={<AlertTriangle size={24} />}
          title="Panne urgente"
          desc="Plus d'eau chaude, plus de chauffage. Priorité absolue, intervention dans la journée."
          tone="raspberry"
        />
      </div>
    </section>
  );
}
