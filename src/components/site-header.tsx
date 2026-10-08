"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { content } from "@/lib/content";
import { locales, localeNames, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const c = content[locale];
  const pathname = usePathname();
  const router = useRouter();
  const links = (["product", "simulator", "architecture", "pricing", "about"] as const).map((page) => (
    <Link key={page} href={`/${locale}/${page}`} aria-current={pathname === `/${locale}/${page}` ? "page" : undefined}>{c.nav[page]}</Link>
  ));
  return <>
    <a className="skip-link" href="#main">{c.skip}</a>
    <div className="announcement"><span className="status-dot" />{c.statusLong}<Link href={`/${locale}/contact`}>{locale === "en" ? "Join the conversation" : locale === "vi" ? "Trao đổi cùng chúng tôi" : "参与讨论"} <span aria-hidden="true">↗</span></Link></div>
    <header className="site-header">
      <div className="container header-inner">
        <Link className="wordmark" href={`/${locale}`} aria-label="THV-guard"><Image src="/brand/thv-mark.svg" width={36} height={36} alt="" /><span>THV<span className="wordmark-light">-guard</span></span></Link>
        <nav className="desktop-nav" aria-label={c.menu}>{links}</nav>
        <div className="header-actions">
          <label className="language-picker"><span className="sr-only">{c.language}</span><select aria-label={c.language} value={locale} onChange={(event) => router.push(pathname.replace(/^\/(en|vi|zh)(?=\/|$)/, `/${event.target.value}`))}>{locales.map((lang) => <option key={lang} value={lang} lang={lang}>{localeNames[lang]}</option>)}</select></label>
          <Link className="button button-small button-primary header-cta" href={`/${locale}/contact`}>{c.book}<span aria-hidden="true">↗</span></Link>
          <details className="mobile-menu"><summary aria-label={c.menu}><span className="menu-lines" aria-hidden="true">☰</span></summary><nav aria-label={c.menu}>{links}<Link href={`/${locale}/contact`}>{c.book}</Link></nav></details>
        </div>
      </div>
    </header>
  </>;
}
