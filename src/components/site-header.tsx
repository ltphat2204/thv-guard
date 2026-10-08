"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { content } from "@/lib/content";
import { locales, localeNames, localized, type Locale } from "@/lib/i18n";
import { CompanyBrand } from "./company-brand";

export function SiteHeader({ locale }: { locale: Locale }) {
  const c = content[locale];
  const pathname = usePathname();
  const router = useRouter();
  const links = (["product", "simulator", "architecture", "pricing", "about"] as const).map((page) => (
    <Link key={page} href={`/${locale}/${page}`} aria-current={pathname === `/${locale}/${page}` ? "page" : undefined}>{c.nav[page]}</Link>
  ));
  const languagePicker = (className: string) => <label className={`language-picker ${className}`}>
    <span className="sr-only">{c.language}</span><select aria-label={c.language} value={locale} onChange={(event) => router.push(pathname.replace(/^\/(en|zh)(?=\/|$)/, `/${event.target.value}`))}>{locales.map((lang) => <option key={lang} value={lang} lang={lang}>{localeNames[lang]}</option>)}</select>
  </label>;
  return <>
    <a className="skip-link" href="#main">{c.skip}</a>
    <div className="announcement"><div className="container"><span>{localized(locale, "AI security for business-critical workflows.", "为关键业务流程构建 AI 安全。")}</span><Link href={`/${locale}/about`}>{c.nav.about} <span aria-hidden="true">↗</span></Link></div></div>
    <header className="site-header"><div className="container header-inner">
      <CompanyBrand locale={locale} />
      <nav className="desktop-nav" aria-label={c.menu}>{links}</nav>
      <div className="header-actions">
        {languagePicker("header-language")}
        <Link className="button button-small button-primary header-cta" href={`/${locale}/contact`}>{c.book}<span aria-hidden="true">↗</span></Link>
        <details className="mobile-menu"><summary aria-label={c.menu}><span className="menu-lines" aria-hidden="true">☰</span></summary><nav aria-label={c.menu}>{links}<Link href={`/${locale}/contact`}>{c.book}</Link>{languagePicker("menu-language")}</nav></details>
      </div>
    </div></header>
  </>;
}
