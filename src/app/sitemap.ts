import type { MetadataRoute } from "next";

const SUPPORTED_LANGS = ["en", "zh"] as const;
const SUPPORTED_COUNTRIES = ["global", "us", "cn", "jp", "fr", "th"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  for (const lang of SUPPORTED_LANGS) {
    urls.push({
      url: `${baseUrl}/${lang}/generator/global`,
      changeFrequency: "daily",
      priority: 0.8,
    });

    for (const country of SUPPORTED_COUNTRIES) {
      urls.push({
        url: `${baseUrl}/${lang}/generator/${country}`,
        changeFrequency: "weekly",
        priority: country === "global" ? 0.8 : 0.6,
      });
    }
  }

  return urls;
}


