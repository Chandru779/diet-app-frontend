"use client";

import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";
import { HomeCategoryCards } from "./home-category-cards";
import { HomeCtaBanner } from "./home-cta-banner";
import { HomeDiscoverMeals } from "./home-discover-meals";
import { HomeHero } from "./home-hero";
import { HomeMealCarousel } from "./home-meal-carousel";
import { HomeQuickTiles } from "./home-quick-tiles";
import { HomeWhyDietician } from "./home-why-dietician";

export function HomeLanding() {
  return (
    <>
      <RedirectIfAuthed to="/feed" />
      <main className="relative min-h-[100dvh] bg-[#f8faf9]">
        <div className="relative mx-auto flex w-full min-w-0 max-w-sm flex-col gap-5 px-4 py-5 pb-10">
          <HomeHero />
          <HomeCategoryCards />
          <HomeDiscoverMeals />
          <HomeWhyDietician />
          <HomeCtaBanner />
          <HomeQuickTiles />
          <HomeMealCarousel />
        </div>
      </main>
    </>
  );
}
