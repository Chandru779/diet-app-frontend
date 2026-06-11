type FeedSectionHeaderProps = {
  title: string;
  onViewAll?: () => void;
};

export function FeedSectionHeader({
  title,
  onViewAll,
}: FeedSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="m-0 min-w-0 font-heading text-lg font-bold leading-tight text-foreground">
        {title}
      </h2>
      {onViewAll ? (
        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 text-xs font-semibold leading-none text-primary transition hover:underline"
        >
          View all
        </button>
      ) : (
        <span className="shrink-0 text-xs font-semibold leading-none text-primary">
          View all
        </span>
      )}
    </div>
  );
}
