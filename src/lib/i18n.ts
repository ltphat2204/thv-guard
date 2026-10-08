export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const localeNames: Record<Locale, string> = { en: "English", zh: "简体中文" };
export const languageTags: Record<Locale, string> = { en: "en", zh: "zh-Hans" };
export const company = "Tuan Hung Vu Technologies Pte. Ltd.";
export const contactEmail = "contact@tuanhungvu.com";
export const companyAddress = "Ayer Rajah Industrial Estate, Singapore";
export const companyAccelerator = "BLOCK71";
export function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
export function localized(locale: Locale, en: string, zh: string) { return { en, zh }[locale]; }
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export function mailLink(subject: string, body = "") { return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; }
