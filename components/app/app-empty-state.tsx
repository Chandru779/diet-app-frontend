import { cn } from "@/lib/utils";

type AppEmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function AppEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: AppEmptyStateProps) {
  return (
    <div
      className={cn(
        "meal-card flex flex-col items-center rounded-2xl bg-white px-6 py-10 text-center shadow-sm",
        className,
      )}
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="font-heading text-base font-bold text-foreground">
        {title}
      </p>
      <p className="mt-1.5 max-w-[16rem] text-[13px] leading-snug text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
