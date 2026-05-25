import {
  BarChart3,
  Bookmark,
  Leaf,
  ShieldCheck,
  Target,
} from "lucide-react";
import { MARKETING_COPY } from "@/lib/constants/marketing-copy";

const FEATURE_ICONS = [Leaf, Target, ShieldCheck, Bookmark, BarChart3] as const;

export function HomeWhyDietician() {
  return (
    <section className="space-y-4">
      <h2 className="text-center font-heading text-base font-bold text-foreground">
        {MARKETING_COPY.whyTitle}
      </h2>
      <div className="grid grid-cols-5 gap-2">
        {MARKETING_COPY.features.map((feat, i) => {
          const Icon = FEATURE_ICONS[i];
          return (
            <div key={feat.title} className="flex flex-col items-center gap-1.5 text-center">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <Icon className="size-4" strokeWidth={2} aria-hidden />
              </span>
              <p className="text-[9px] font-bold leading-tight text-foreground">
                {feat.title}
              </p>
              <p className="text-[8px] leading-tight text-muted-foreground">
                {feat.sub}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
