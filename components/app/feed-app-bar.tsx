import { BellDot } from "lucide-react";

type FeedAppBarProps = {
  greeting: string;
  headline: string;
};

export function FeedAppBar({ greeting, headline }: FeedAppBarProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground">{greeting}</p>
        <h1 className="font-heading text-2xl font-bold leading-tight">
          {headline}
        </h1>
      </div>
      <button
        type="button"
        aria-label="Notifications"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-muted-foreground shadow-sm backdrop-blur-sm"
      >
        <BellDot className="size-5" />
      </button>
    </div>
  );
}
