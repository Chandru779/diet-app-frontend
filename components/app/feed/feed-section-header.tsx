type FeedSectionHeaderProps = {
  title: string;
  onViewAll?: () => void;
};

export function FeedSectionHeader({ title, onViewAll }: FeedSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
      {onViewAll ? (
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-semibold text-primary transition hover:underline"
        >
          View all
        </button>
      ) : (
        <span className="text-sm font-semibold text-primary">View all</span>
      )}
    </div>
  );
}
