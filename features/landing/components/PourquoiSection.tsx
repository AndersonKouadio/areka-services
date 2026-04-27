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
    <section id="pourquoi" className="bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Pourquoi nous choisir
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="text-center">
              <div className="bg-areka-orange/10 text-areka-orange mx-auto mb-3 flex size-12 items-center justify-center rounded-xl">
                {it.icon}
              </div>
              <h3 className="font-semibold">{it.title}</h3>
              <p className="text-foreground/70 mt-1 text-sm">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
