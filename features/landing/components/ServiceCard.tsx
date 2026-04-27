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
    <Card className="border-border/50 hover:shadow-md transition border">
      <Card.Header>
        <div
          className={`flex size-12 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          {icon}
        </div>
        <Card.Title className="mt-4">{title}</Card.Title>
        <Card.Description>{desc}</Card.Description>
      </Card.Header>
    </Card>
  );
}
