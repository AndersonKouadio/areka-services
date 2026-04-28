import { Clock, ShieldCheck, MapPin, Award } from 'lucide-react';

export function PourquoiSection() {
  const items = [
    {
      icon: <Clock size={24} />,
      title: 'Réactivité',
      desc: 'Réponse sous 24h, intervention sous 48h en moyenne.',
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Expertise',
      desc: '15 ans dans le métier, toutes marques de chaudières.',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Local',
      desc: 'Basé à Cholet, à votre service en Maine-et-Loire.',
    },
    {
      icon: <Award size={24} />,
      title: 'Devis gratuit',
      desc: 'Sans engagement, transparent sur les tarifs.',
    },
  ];
  return (
    <section id="pourquoi" className="bg-muted/50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="text-areka-orange text-sm font-semibold uppercase tracking-widest">
            Confiance
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl text-balance">
            Pourquoi nous choisir
          </h2>
          <p className="text-foreground/70 mx-auto mt-4 max-w-xl text-lg leading-relaxed">
            Un artisan local, transparent et réactif pour votre confort au quotidien.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="bg-surface/70 border-border/50 hover:border-border hover:shadow-md transition rounded-2xl border p-6 text-center"
            >
              <div className="bg-areka-orange/10 text-areka-orange mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl">
                {it.icon}
              </div>
              <h3 className="font-semibold text-lg">{it.title}</h3>
              <p className="text-foreground/70 mt-2 text-sm leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
