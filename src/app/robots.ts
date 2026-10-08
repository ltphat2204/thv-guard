import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/i18n";
export default function robots(): MetadataRoute.Robots {
  const publicSite = !!process.env.NEXT_PUBLIC_SITE_URL && !siteUrl.includes("localhost");
  return { rules: { userAgent: "*", ...(publicSite ? { allow: "/", disallow: ["/api/"] } : { disallow: "/" }) }, ...(publicSite ? { sitemap: `${siteUrl}/sitemap.xml` } : {}) };
}
