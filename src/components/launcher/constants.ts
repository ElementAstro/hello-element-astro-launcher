export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 50];

export const CATEGORIES = [
  "all",
  "deepspace",
  "planets",
  "guiding",
  "analysis",
  "drivers",
  "vendor",
  "utilities",
] as const;

export type Category = typeof CATEGORIES[number];