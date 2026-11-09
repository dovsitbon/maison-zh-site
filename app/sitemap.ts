import type { MetadataRoute } from "next";
import site from "@/data/site.json";
import { locales } from "@/lib/i18n";
import { SERVICES_PAGES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...SERVICES_PAGES.map((s) => `/${s.slug}`), "/formules", "/mentions-legales"].flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "/mentions-legales" ? ("yearly" as const) : ("weekly" as const),
      priority: path === "/mentions-legales" ? 0.2 : path ? 0.8 : lang === "fr" ? 1 : 0.9,
      alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])), "x-default": `${site.url}/fr${path}` } },
    })),
  );
}
