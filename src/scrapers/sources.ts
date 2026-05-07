export interface ScrapeSource {
  subreddit: string;
  categorySlug: string;
  size: number;
}

export const sources: ScrapeSource[] = [
  { subreddit: "MechanicAdvice", categorySlug: "repair", size: 15 },
  { subreddit: "Cartalk", categorySlug: "repair", size: 10 },
  { subreddit: "AutoDetailing", categorySlug: "detailing", size: 10 },
  { subreddit: "cars", categorySlug: "buying-advice", size: 15 },
  { subreddit: "whatcarshouldIbuy", categorySlug: "buying-advice", size: 10 },
  { subreddit: "carmodification", categorySlug: "mods-tuning", size: 10 },
  { subreddit: "projectcar", categorySlug: "mods-tuning", size: 10 },
  { subreddit: "DIYAutoRepair", categorySlug: "diy-guides", size: 10 },
  { subreddit: "Justrolledintotheshop", categorySlug: "repair", size: 10 },
  { subreddit: "CarHacking", categorySlug: "mods-tuning", size: 5 },
];
