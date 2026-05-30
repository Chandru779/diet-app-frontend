"use client";

import { useEffect, useState } from "react";
import { FeedSectionHeader } from "@/components/app/feed/feed-section-header";
import { FeedTodaysPickCard } from "@/components/app/feed/feed-todays-pick-card";
import { FeedHighProteinCard } from "@/components/app/feed/feed-high-protein-card";
import { FeedExploreTile } from "@/components/app/feed/feed-explore-tile";
import { FeedRecentlyViewedCard } from "@/components/app/feed/feed-recently-viewed-card";
import { FeedCollectionBanner } from "@/components/app/feed/feed-collection-banner";
import { FeedCreateMealBanner } from "@/components/app/feed/feed-create-meal-banner";
import { fetchCollections } from "@/lib/api/collections";
import type { MealCollectionSummary } from "@/lib/api/collections";
import type { FeedSection } from "@/lib/types/feed";

type FeedHomeSectionsProps = {
  sections: FeedSection[];
  onViewAll?: (sectionId: string) => void;
  onExploreCategory?: (slug: string) => void;
};

export function FeedHomeSections({
  sections,
  onViewAll,
  onExploreCategory,
}: FeedHomeSectionsProps) {
  const [collections, setCollections] = useState<MealCollectionSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchCollections()
      .then((data) => {
        if (!cancelled) setCollections(data.slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setCollections([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section) => {
        if (section.type === "carousel") {
          const isRecentlyViewed = section.id === "recently-viewed";

          return (
            <section
              key={section.id}
              className="flex flex-col gap-3"
              aria-labelledby={`section-${section.id}`}
            >
              <FeedSectionHeader
                title={section.title}
                onViewAll={
                  onViewAll ? () => onViewAll(section.id) : undefined
                }
              />
              <div
                className="-mx-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                id={`section-${section.id}`}
              >
                <div className="flex w-max snap-x snap-mandatory gap-3 px-4">
                  {section.items.map((meal) =>
                    isRecentlyViewed ? (
                      <FeedRecentlyViewedCard key={meal.id} meal={meal} />
                    ) : (
                      <FeedTodaysPickCard key={meal.id} meal={meal} />
                    ),
                  )}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "list") {
          return (
            <section
              key={section.id}
              className="flex flex-col gap-3"
              aria-labelledby={`section-${section.id}`}
            >
              <FeedSectionHeader
                title={section.title}
                onViewAll={
                  onViewAll ? () => onViewAll(section.id) : undefined
                }
              />
              <ul className="flex flex-col gap-3" id={`section-${section.id}`}>
                {section.items.map((meal) => (
                  <li key={meal.id}>
                    <FeedHighProteinCard meal={meal} />
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (section.type === "category_grid") {
          return (
            <section
              key={section.id}
              className="flex flex-col gap-3"
              aria-labelledby={`section-${section.id}`}
            >
              <FeedSectionHeader
                title={section.title}
                onViewAll={
                  onViewAll ? () => onViewAll(section.id) : undefined
                }
              />
              <div
                className="-mx-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                id={`section-${section.id}`}
              >
                <div className="flex w-max snap-x snap-mandatory gap-3 px-4">
                  {(section.categories ?? []).map((cat) => (
                    <FeedExploreTile
                      key={cat.slug}
                      slug={cat.slug}
                      label={cat.label}
                      onSelect={onExploreCategory}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}

      {collections.length > 0 ? (
        <section
          className="flex flex-col gap-3"
          aria-labelledby="section-meal-collections"
        >
          <FeedSectionHeader title="Meal Collections" />
          <div className="-mx-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max snap-x snap-mandatory gap-3 px-4">
              {collections.map((col, i) => (
                <FeedCollectionBanner key={col.id} collection={col} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FeedCreateMealBanner />
    </div>
  );
}
