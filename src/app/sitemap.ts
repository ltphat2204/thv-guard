import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { locales, languageTags, siteUrl } from "@/lib/i18n";
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => pages.map((page) => ({
    url: `${siteUrl}/${locale}${page ? `/${page}` : ""}`,
    alternates: { languages: Object.fromEntries(locales.map((lang) => [languageTags[lang], `${siteUrl}/${lang}${page ? `/${page}` : ""}`])) },
  })));
}
