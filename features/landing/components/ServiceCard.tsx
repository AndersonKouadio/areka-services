import { Card } from '@heroui/react';

export function ServiceCard({
  icon,
  title,
  desc,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone: 'navy' | 'orange' | 'raspberry';
}) {
  const tones = {
    navy: 'text-areka-navy bg-areka-navy/10',
    orange: 'text-areka-orange bg-areka-orange/10',
    raspberry: 'text-areka-raspberry bg-areka-raspberry/10',
  };
  return (
    <Card className="border-border/60 hover:border-border hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border bg-surface/90 backdrop-blur p-2">
      <Card.Header>
        <div
          className={`flex size-12 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          {icon}
        </div>
        <Card.Title className="mt-5 text-xl">{title}</Card.Title>
        <Card.Description className="mt-2 leading-relaxed text-foreground/70">{desc}</Card.Description>
      </Card.Header>
    </Card>
  );
}
