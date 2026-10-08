import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/sections";
import { isLocale, languageTags, siteUrl, locales } from "@/lib/i18n";
import "../globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Tuan Hung Vu Technologies Pte. Ltd. | Business Integrity", template: "%s | Tuan Hung Vu Technologies Pte. Ltd." },
  applicationName: "Tuan Hung Vu Technologies Pte. Ltd.",
  icons: { icon: "/brand/company-mark.svg", apple: "/brand/company-monogram.png" },
  robots: { index: !!process.env.NEXT_PUBLIC_SITE_URL && !siteUrl.includes("localhost"), follow: true },
};
export const viewport: Viewport = { themeColor: "#faf9f6", colorScheme: "light", width: "device-width", initialScale: 1 };
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={languageTags[locale]} data-theme="light" className={`${sans.variable} ${mono.variable}`}><body><SiteHeader locale={locale} />{children}<Footer locale={locale} /><Analytics /></body></html>;
}
