import { Wrench, Flame, AlertTriangle } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
      <div className="mb-14 text-center">
        <span className="text-areka-orange text-sm font-semibold uppercase tracking-widest">
          Services
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl text-balance">
          Nos services
        </h2>
        <p className="text-foreground/70 mx-auto mt-4 max-w-xl text-lg leading-relaxed">
          Trois interventions principales, prises en charge rapidement.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
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
