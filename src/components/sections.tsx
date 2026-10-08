import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";
import { about } from "@/lib/about";
import { company, companyAddress, companyAccelerator, contactEmail, localized, type Locale } from "@/lib/i18n";
import { GuardAnimation } from "./guard-animation";
import { CompanyBrand } from "./company-brand";

export function Hero({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="hero container">
    <div className="hero-copy"><p className="eyebrow">{localized(locale, "Business-action verification", "业务操作验证")}</p><h1>{c.hero[0]}<span>{c.hero[1]}</span></h1><p className="hero-lead">{c.heroLead}</p><p className="hero-body">{c.heroBody}</p><div className="button-row"><Link className="button button-primary" href={`/${locale}/simulator`}>{c.try}<span aria-hidden="true">→</span></Link><Link className="button button-secondary" href={`/${locale}/contact`}>{c.book}<span aria-hidden="true">↗</span></Link></div><p className="small muted hero-note">{c.demoNote}</p></div>
    <GuardAnimation locale={locale} />
    <div className="hero-footnote"><Image src="/brand/company-mark.svg" width={22} height={22} alt="" /><span>{c.backing}</span></div>
  </section>;
}

export function Problem({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="section container problem-section" id="why"><div className="section-intro"><h2>{c.problemTitle}</h2><p>{c.problemLead}</p></div><div className="problem-list">{c.problems.map(([title, body], index) => <article key={title}><span className="problem-symbol mono" aria-hidden="true">{["≠", "↔", "↻"][index]}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></section>;
}

export function Features({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="section container" id="features"><div className="section-heading"><h2>{c.featuresTitle}</h2><p>{c.featuresLead}</p></div><div className="feature-grid">{c.features.map(([title, body, note], index) => <article className={`feature feature-${index}`} key={title}><div className="feature-heading"><h3>{title}</h3><span className="feature-index mono" aria-hidden="true">{["ƒ", "↔", "∴", "{ }", "⊞"][index]}</span></div><p>{body}</p>{index === 0 && <pre className="feature-code"><code><span className="code-comment">{localized(locale, "// illustrative policy, not an SDK", "// 示例策略，并非 SDK")}</span>{"\n"}amount &lt;= remaining_balance{"\n"}amount &gt; threshold → approval{"\n"}approval.matches(exact_action)</code></pre>}{index === 2 && <div className="decision-states"><span className="status-allow">✓ ALLOW</span><span className="status-approval">Ⅱ APPROVAL</span><span className="status-block">× BLOCK</span></div>}<div className="feature-bottom"><span className="small muted">{note}</span><span className="badge small">{c.proposed}</span></div></article>)}</div></section>;
}

export function SimulatorTeaser({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="section container"><div className="sim-teaser"><div><span className="badge status-allow">{c.available}</span><h2>{c.simulatorTitle}</h2><p>{c.simulatorLead}</p><Link className="text-link" href={`/${locale}/simulator`}>{c.try} <span aria-hidden="true">→</span></Link></div><div className="example-results" aria-label={localized(locale, "Example refund outcomes", "退款结果示例")}>{[["60", "ALLOW", "allow"], ["150", "REQUIRE_APPROVAL", "approval"], ["240", "BLOCK", "block"]].map(([amount, decision, state]) => <div key={amount}><span className="mono">USD {amount}</span><span className={`mono status-${state}`}>{decision}</span></div>)}<p className="small muted">{localized(locale, "USD 200 remaining · USD 100 approval threshold", "剩余 200 美元 · 审批阈值 100 美元")}</p></div></div></section>;
}

export function UseCases({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="section container"><h2>{c.useCasesTitle}</h2><div className="usecase-list">{c.useCases.map(([title, body, status], index) => <article key={title}><div><span className={`badge ${index === 0 ? "status-allow" : ""}`}>{status}</span><h3>{title}</h3></div><p>{body}</p><Link className="usecase-arrow" href={`/${locale}/${index === 0 ? "simulator" : "contact"}`} aria-label={`${title}: ${index === 0 ? c.try : c.book}`}><span aria-hidden="true">↗</span></Link></article>)}</div></section>;
}

export function Comparison({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="section container comparison-section"><div className="section-intro"><h2>{c.comparisonTitle}</h2><p>{c.comparisonLead}</p></div><div className="comparison-columns"><div><h3>{c.existingTitle}</h3><ul>{c.existing.map((item) => <li key={item}><span aria-hidden="true">＋</span>{item}</li>)}</ul></div><div className="focus-column"><h3>{c.focusTitle}</h3><ul>{c.focus.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></div><p className="small muted comparison-note">{c.comparisonNote}</p></div></section>;
}

export function Pricing({ locale, heading = true }: { locale: Locale; heading?: boolean }) {
  const c = content[locale];
  return <section className={heading ? "section container" : "container pricing-page"} id="plans">{heading && <div className="section-heading"><h2>{c.pricingTitle}</h2><p>{c.pricingLead}</p></div>}<div className="pricing-grid">{c.plans.map((plan, index) => <article className={`price-plan ${index === 1 ? "pilot-plan" : ""}`} key={plan.name}><div className="plan-name"><h3>{plan.name}</h3>{index === 1 && <span className="badge">{c.pricingStatus}</span>}</div><p>{plan.description}</p><div className="plan-price">{index === 2 ? localized(locale, "Custom", "定制") : plan.price}{index !== 2 && <> <span className="small muted">USD{index === 1 ? ` ${c.perMonth}` : ""}</span></>}</div><Link className={`button ${index === 1 ? "button-primary" : "button-secondary"}`} href={`/${locale}/${index === 0 ? "simulator" : "contact"}`}>{plan.cta}<span aria-hidden="true">{index === 0 ? "→" : "↗"}</span></Link><ul>{plan.items.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></article>)}</div><p className="pricing-disclaimer small muted">{c.pricingNote}</p></section>;
}

export function Faq({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="section container faq-section" id="faq"><h2>{c.faqTitle}</h2><div className="faq-list">{c.faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div></section>;
}

export function Architecture({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="container architecture-page"><p className="muted architecture-instruction">{c.architectureNote}</p><div className="architecture-flow">{c.stages.map(([name, ...values], index) => <details className={`architecture-stage ${index === 2 ? "guard-stage" : ""}`} key={name} open={index === 2}><summary><span className="stage-number mono">{String(index + 1).padStart(2, "0")}</span><h2>{name}</h2><span className="stage-expand" aria-hidden="true">＋</span></summary><dl>{values.map((value, i) => <div key={i}><dt>{c.architectureLabels[i]}</dt><dd>{value}</dd></div>)}</dl></details>)}</div><aside className="boundary-note"><h2>{c.boundaryTitle}</h2><p>{c.boundaryBody}</p></aside></section>;
}

export function Principles({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="section container principles-section"><h2>{c.principlesTitle}</h2><div>{c.principles.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>;
}

export function Cta({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <section className="container closing-cta"><div><h2>{c.ctaTitle}</h2><p>{c.ctaBody}</p><p className="small muted">{c.ctaNote}</p></div><Link href={`/${locale}/contact`} className="button button-primary">{c.book}<span aria-hidden="true">↗</span></Link></section>;
}

export function About({ locale }: { locale: Locale }) {
  const story = about[locale];
  const c = content[locale];
  return <>
    <section className="container about-company"><div><h2>{story.companyTitle}</h2><p className="about-company-name">{company}</p><p>{story.companyBody}</p><dl className="company-facts"><div><dt>{localized(locale, "Accelerator", "加速器")}</dt><dd>{companyAccelerator}</dd></div><div><dt>{localized(locale, "Address", "地址")}</dt><dd><address className="company-address">{companyAddress}</address></dd></div></dl></div><Image src="/brand/company-mark.svg" width={280} height={233} alt="" /></section>
    <section className="container about-story"><h2>{story.storyTitle}</h2><div className="about-chapters">{story.stages.map((stage) => <article key={stage.period}><p className="about-period mono">{stage.period}</p><h3>{stage.title}</h3>{stage.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>)}</div></section>
    <section className="container about-next"><blockquote><p>{story.thesis}</p></blockquote><div><h2>{story.nextTitle}</h2><p>{story.nextBody}</p><p className="small muted">{story.status}</p><div className="button-row"><Link className="button button-primary" href={`/${locale}/simulator`}>{c.try}<span aria-hidden="true">→</span></Link><Link className="button button-secondary" href={`/${locale}/contact`}>{c.book}<span aria-hidden="true">↗</span></Link></div></div></section>
  </>;
}

export function Footer({ locale }: { locale: Locale }) {
  const c = content[locale];
  return <footer className="site-footer"><div className="container"><div className="footer-main"><div><CompanyBrand locale={locale} /><p>{c.footerLine}</p></div><div className="footer-contact"><a href={`mailto:${contactEmail}`}>{contactEmail} <span aria-hidden="true">↗</span></a><p>{company}</p><address className="company-address">{companyAddress}</address></div></div><div className="footer-bottom"><p>© 2026 {company}</p><div><Link href={`/${locale}/about`}>{c.nav.about}</Link><Link href={`/${locale}/privacy`}>{c.nav.privacy}</Link><span>{c.footerResearch}</span></div></div></div></footer>;
}
