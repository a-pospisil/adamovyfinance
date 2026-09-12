import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Only canonical, indexable URLs. The privacy page is intentionally excluded (noindex). */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/financovani", priority: 0.9, changeFrequency: "monthly" },
  { path: "/workshopy", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pripadove-studie", priority: 0.8, changeFrequency: "monthly" },
  { path: "/o-adamovi", priority: 0.8, changeFrequency: "monthly" },
  { path: "/nastroje", priority: 0.7, changeFrequency: "monthly" },
  { path: "/kontakt", priority: 0.7, changeFrequency: "yearly" },
];

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
