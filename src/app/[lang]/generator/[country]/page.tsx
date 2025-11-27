import type { Metadata, ResolvingMetadata } from "next";
import { HomeClient } from "@/components/HomeClient";

type Params = {
  params: {
    lang: string;
    country: string;
  };
};

const SUPPORTED_LANGS = ["en", "zh"] as const;
const SUPPORTED_COUNTRIES = ["global", "us", "cn", "jp", "fr", "th"] as const;

type Lang = (typeof SUPPORTED_LANGS)[number];
type CountrySlug = (typeof SUPPORTED_COUNTRIES)[number];

function normalizeLang(raw: string): Lang {
  const lower = raw.toLowerCase();
  if (SUPPORTED_LANGS.includes(lower as Lang)) return lower as Lang;
  return "en";
}

function normalizeCountry(raw: string): CountrySlug {
  const lower = raw.toLowerCase();
  if (SUPPORTED_COUNTRIES.includes(lower as CountrySlug)) {
    return lower as CountrySlug;
  }
  return "global";
}

function countryCodeFromSlug(slug: CountrySlug): string {
  switch (slug) {
    case "us":
      return "US";
    case "cn":
      return "CN";
    case "jp":
      return "JP";
    case "fr":
      return "FR";
    case "th":
      return "TH";
    case "global":
    default:
      return "GLOBAL";
  }
}

function countryLabel(lang: Lang, code: string): string {
  const upper = code.toUpperCase();
  if (lang === "zh") {
    switch (upper) {
      case "US":
        return "美国";
      case "CN":
        return "中国";
      case "JP":
        return "日本";
      case "FR":
        return "法国";
      case "TH":
        return "泰国";
      case "GLOBAL":
      default:
        return "全球";
    }
  }

  // en
  switch (upper) {
    case "US":
      return "United States";
    case "CN":
      return "China";
    case "JP":
      return "Japan";
    case "FR":
      return "France";
    case "TH":
      return "Thailand";
    case "GLOBAL":
    default:
      return "Global";
  }
}

export async function generateMetadata(
  { params }: Params,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const lang = normalizeLang(params.lang);
  const slug = normalizeCountry(params.country);
  const countryCode = countryCodeFromSlug(slug);
  const label = countryLabel(lang, countryCode);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://random-travel-gen.vercel.app";

  const title =
    lang === "zh"
      ? `随机旅行目的地生成器 · ${label}`
      : `Random Travel Destination Generator · ${label}`;

  const description =
    lang === "zh"
      ? `为你在 ${label} 随机挑选一个城市，配合酷炫地图动画和 AI 旅行建议。`
      : `Throw a virtual dart at the map and get a random destination in ${label}, with cinematic map animation and AI travel tips.`;

  const url = `${baseUrl}/${lang}/generator/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const langs = SUPPORTED_LANGS;
  const countries = SUPPORTED_COUNTRIES;

  const params: { lang: string; country: string }[] = [];
  for (const lang of langs) {
    for (const country of countries) {
      params.push({ lang, country });
    }
  }

  return params;
}

export default function GeneratorPage({ params }: Params) {
  const lang = normalizeLang(params.lang);
  const slug = normalizeCountry(params.country);
  const countryCode = countryCodeFromSlug(slug);
  const label = countryLabel(lang, countryCode);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://random-travel-gen.vercel.app";
  const url = `${baseUrl}/${lang}/generator/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name:
      lang === "zh"
        ? `随机旅行目的地生成器 · ${label}`
        : `Random Travel Destination Generator · ${label}`,
    url,
    inLanguage: lang,
    applicationCategory: "TravelApplication",
    description:
      lang === "zh"
        ? `通过扔飞镖的方式随机探索 ${label} 的旅行城市，辅以地图动画、维基百科摘要与 AI 旅行建议。`
        : `Discover random destinations in ${label} with a dart-throwing style map animation, Wikipedia summaries, and AI-powered travel tips.`,
  };

  return (
    <>
      <HomeClient lang={lang} initialCountry={countryCode} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}


