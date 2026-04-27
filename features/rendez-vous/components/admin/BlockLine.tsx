interface BlockLineProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function BlockLine({ label, icon, children }: BlockLineProps) {
  return (
    <div>
      <p className="text-foreground/60 mb-1 inline-flex items-center gap-1 text-xs">
        {icon}
        {label}
      </p>
      <p className="text-sm font-medium">{children}</p>
    </div>
  );
}
