export const MARKETING_COPY = {
  headlineLine1: "Eat Clean.",
  headlineLine2: "Build Strong.",
  heroSubtext:
    "Your goals. Our meals. Real results. Millions of healthy meals to power your best self.",
  signIn: "Sign in",

  vegCardTitle: "Lets build",
  vegCardHighlight: "Clean Muscle",
  vegCardSuffix: "with Diet",
  vegCardSub: "100% Veg & Wholesome Meals",
  vegExplore: "Explore Veg Meals",

  nonVegCardTitle: "Tasty Meals",
  nonVegCardHighlight: "You'll Love",
  nonVegCardSub: "High Protein & Delicious",
  nonVegExplore: "Explore Non-Veg",

  discoverTitle: "Discover Meals You'll Love",
  discoverSubtext: "Swipe · tap a card to open the full meal",
  seeAll: "See all",

  whyTitle: "Why Dietician?",
  features: [
    {
      title: "Clean Ingredients",
      sub: "100% Veg & Non-Veg Meals",
    },
    {
      title: "Macro Tracked",
      sub: "Protein, Carbs & Fats Instantly",
    },
    {
      title: "Expert Designed",
      sub: "Nutritionist Approved",
    },
    {
      title: "Save & Organize",
      sub: "Save your favorite meals",
    },
    {
      title: "Goal Focused",
      sub: "Meals that help you achieve more",
    },
  ] as const,

  ctaText: "Join thousands of people eating clean and living better every day.",
  ctaButton: "Sign In to Get Started",
  statMeals: "2M+",
  statMealsLabel: "Meals",
  statUsers: "500K+",
  statUsersLabel: "Happy Users",
  statFree: "100%",
  statFreeLabel: "Free Forever",

  exploreTitle: "Find Your Next Meal",
  exploreSubtext: "Track macros instantly",
  browseAll: "Browse all meals",

  myCreations: "My Creations",
  myCreationsDesc: "Meals you've created",
  savedMeals: "Saved Meals",
  savedMealsDesc: "Meals you've saved",
} as const;

export const MARKETING_ASSETS = {
  heroBowl: "/assets/home/hero-bowl.png",
  vegMeal: "/assets/home/veg_meal.png",
  nonVegCategory: "/assets/home/non-veg-category.png",
  ctaCharacter: "/assets/home/cta-character.png",
  meals: [
    {
      id: "discover-1",
      title: "Paneer Power Bowl",
      image: "/assets/home/meal-1.png",
      proteinG: 32,
      carbsG: 42,
      fatG: 12,
    },
    {
      id: "discover-2",
      title: "Grilled Chicken Bowl",
      image: "/assets/home/meal-2.png",
      proteinG: 38,
      carbsG: 35,
      fatG: 14,
    },
    {
      id: "discover-3",
      title: "Egg Toast Plate",
      image: "/assets/home/meal-3.png",
      proteinG: 24,
      carbsG: 48,
      fatG: 16,
    },
  ],
} as const;

/** Static previews when API is unavailable — matches seed Unsplash URLs */
export const MARKETING_PREVIEW_MEALS = [
  {
    id: "preview-1",
    title: "Grilled Chicken Bowl",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&fit=crop",
    proteinG: 55,
  },
  {
    id: "preview-2",
    title: "Tofu Stir Fry",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&fit=crop",
    proteinG: 42,
  },
  {
    id: "preview-3",
    title: "Egg Toast Plate",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&fit=crop",
    proteinG: 28,
  },
] as const;
