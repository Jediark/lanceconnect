import { cn } from "@/lib/utils";

export function Header({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-b border-border bg-background px-4 py-6 lg:px-8",
        className,
      )}
    >
      <h1 className="font-display text-2xl font-bold leading-tight text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
