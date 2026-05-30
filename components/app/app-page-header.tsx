import { cn } from "@/lib/utils";

type AppPageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
};

export function AppPageHeader({
  title,
  subtitle,
  className,
  children,
}: AppPageHeaderProps) {
  return (
    <div
      className={cn(
        "bg-feed-header -mx-4 rounded-br-[1.75rem] px-5 pb-4 pt-2",
        className,
      )}
    >
      <h1 className="font-heading text-[1.75rem] font-bold leading-[1.12] tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
