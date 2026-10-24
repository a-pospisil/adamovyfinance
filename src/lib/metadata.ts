import type { Metadata } from "next";
import { SITE } from "@/lib/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
};

/** Consistent per-page metadata with canonical + Open Graph. */
export function pageMetadata({ title, description, path, image = "/og.jpg", type = "website" }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: SITE.locale,
      siteName: SITE.brand,
      url: path,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE.brand} – ${SITE.tagline}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
