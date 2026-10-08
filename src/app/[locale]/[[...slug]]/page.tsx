import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { About, Architecture, Comparison, Cta, Faq, Features, Hero, Pricing, Principles, Problem, SimulatorTeaser, UseCases } from "@/components/sections";
import { Simulator } from "@/components/simulator";
import { ContactForm } from "@/components/contact-form";
import { content, pages, pageTitle, type Page as PageName } from "@/lib/content";
import { about } from "@/lib/about";
import { company, contactEmail, isLocale, languageTags, localized, locales, siteUrl, type Locale } from "@/lib/i18n";

type Params = { locale: string; slug?: string[] };
export const dynamicParams = false;
export function generateStaticParams() { return pages.map((page) => ({ slug: page ? [page] : [] })); }

function resolve({ locale, slug }: Params): { locale: Locale; page: PageName } {
  const page = slug?.join("/") || "";
  if (!isLocale(locale) || !pages.includes(page as PageName)) notFound();
  return { locale, page: page as PageName };
}

function description(locale: Locale, page: PageName) {
  const c = content[locale];
  return ({ "": c.heroBody, product: c.productLead, simulator: c.simulatorLead, architecture: c.architectureLead, pricing: c.pricingLead, about: about[locale].lead, contact: c.contactLead, privacy: c.privacyLead })[page];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, page } = resolve(await params);
  const path = `${locale}${page ? `/${page}` : ""}`;
  const title = pageTitle(locale, page);
  const desc = description(locale, page);
  const languages = Object.fromEntries(locales.map((lang) => [languageTags[lang], `${siteUrl}/${lang}${page ? `/${page}` : ""}`]));
  return {
    title, description: desc,
    alternates: { canonical: `${siteUrl}/${path}`, languages: { ...languages, "x-default": `${siteUrl}/en${page ? `/${page}` : ""}` } },
    openGraph: { type: "website", title: `${title} | THV-guard`, description: desc, url: `${siteUrl}/${path}`, siteName: "THV-guard", locale: { en: "en_SG", vi: "vi_VN", zh: "zh_CN" }[locale], alternateLocale: locales.filter((lang) => lang !== locale).map((lang) => ({ en: "en_SG", vi: "vi_VN", zh: "zh_CN" }[lang])), images: [{ url: `${siteUrl}/${locale}/opengraph-image`, width: 1200, height: 630, alt: "THV-guard — Verify the action. Not just the agent." }] },
    twitter: { card: "summary_large_image", title: `${title} | THV-guard`, description: desc, images: [`${siteUrl}/${locale}/opengraph-image`] },
  };
}

function StructuredData({ locale, page }: { locale: Locale; page: PageName }) {
  const c = content[locale];
  const organization = { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: company, email: contactEmail, logo: `${siteUrl}/brand/thv-mark.svg` };
  const webPage = { "@type": page === "about" ? "AboutPage" : "WebPage", ...(page === "about" ? { mainEntity: { "@id": `${siteUrl}/#organization` } } : {}), "@id": `${siteUrl}/${locale}${page ? `/${page}` : ""}#webpage`, name: pageTitle(locale, page), description: description(locale, page), inLanguage: languageTags[locale], publisher: { "@id": `${siteUrl}/#organization` } };
  const graph: unknown[] = [organization, webPage];
  if (page === "") graph.push({ "@type": "SoftwareApplication", name: "THV-guard", applicationCategory: "DeveloperApplication", operatingSystem: "Web", description: c.productDefinition, softwareVersion: "Research preview", publisher: { "@id": `${siteUrl}/#organization` } }, { "@type": "FAQPage", mainEntity: c.faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) });
  if (page) graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "THV-guard", item: `${siteUrl}/${locale}` }, { "@type": "ListItem", position: 2, name: pageTitle(locale, page), item: `${siteUrl}/${locale}/${page}` }] });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale, page } = resolve(await params);
  const c = content[locale];
  const heading = { product: c.productTitle, simulator: c.simulatorTitle, architecture: c.architectureTitle, pricing: c.pricingTitle, about: about[locale].title, contact: c.contactTitle, privacy: c.privacyTitle };
  return <main id="main"><StructuredData locale={locale} page={page} />
    {page === "" ? <><Hero locale={locale} /><Problem locale={locale} /><Features locale={locale} /><SimulatorTeaser locale={locale} /><UseCases locale={locale} /><Comparison locale={locale} /><section className="container architecture-link"><div><h2>{c.architectureTitle}</h2><p>{c.architectureLead}</p></div><Link className="text-link" href={`/${locale}/architecture`}>{c.learn} <span aria-hidden="true">→</span></Link></section><Pricing locale={locale} /><Faq locale={locale} /><Cta locale={locale} /></> : <>
      <header className={`container page-heading ${page === "simulator" ? "sim-page-heading" : ""}`}><Link className="breadcrumb" href={`/${locale}`}><span aria-hidden="true">←</span> THV-guard</Link><div className="page-heading-content"><span className="badge">{page === "about" ? about[locale].since : c.status}</span><h1>{heading[page]}</h1><p>{description(locale, page)}</p></div></header>
      {page === "product" && <><section className="container product-definition"><p className="definition-lead">{c.productDefinition}</p><p className="muted">{c.preview}</p><div className="button-row"><Link className="button button-primary" href={`/${locale}/simulator`}>{c.try} →</Link><Link className="button button-secondary" href={`/${locale}/contact`}>{c.book} ↗</Link></div></section><Features locale={locale} /><Principles locale={locale} /><UseCases locale={locale} /><Comparison locale={locale} /><Cta locale={locale} /></>}
      {page === "simulator" && <><section className="container simulator-page"><p className="demo-disclosure"><span aria-hidden="true">ⓘ</span>{c.demoNote}</p><Simulator locale={locale} /></section><aside className="container boundary-note"><h2>{c.boundaryTitle}</h2><p>{c.boundaryBody}</p></aside></>}
      {page === "architecture" && <><Architecture locale={locale} /><Cta locale={locale} /></>}
      {page === "about" && <About locale={locale} />}
      {page === "pricing" && <><Pricing locale={locale} heading={false} /><Faq locale={locale} /><Cta locale={locale} /></>}
      {page === "contact" && <section className="container contact-layout"><aside className="contact-aside"><h2>{localized(locale, "A technical conversation. Not a sales script.", "Trao đổi kỹ thuật. Không chỉ chào bán.", "技术交流，而非销售话术。")}</h2><p>{c.ctaNote}</p><a className="text-link" href={`mailto:${contactEmail}`}>{contactEmail} ↗</a><div className="contact-company"><p>{company}</p><p className="small muted">{localized(locale, "Singapore-origin, enterprise-backed startup", "Startup khởi nguồn tại Singapore, được doanh nghiệp tài trợ", "起源于新加坡、获企业资助的初创公司")}</p></div><p className="small muted">{localized(locale, "Your email app opens with a draft. You review it and send it yourself.", "Ứng dụng email mở bản nháp. Bạn kiểm tra và tự gửi thư.", "邮件应用将打开草稿，由您审核并自行发送。")}</p></aside><ContactForm locale={locale} /></section>}
      {page === "privacy" && <section className="container privacy-content">{c.privacySections.map(([title, body], index) => <article key={title}><h2>{index === 2 && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" ? localized(locale, "Cookie-less website analytics", "Phân tích website không dùng cookie", "无 Cookie 的网站分析") : title}</h2><p>{index === 2 && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" ? localized(locale, "Vercel Web Analytics is enabled to measure page views and aggregate interaction events, including simulator decisions and prepared contact requests. We do not send form values, names, email addresses, action payloads, or transaction amounts to analytics. No tracking cookies are used. The hosting provider may process ordinary delivery and security logs.", "Vercel Web Analytics được bật để đo lượt xem và sự kiện tương tác tổng hợp, gồm kết quả mô phỏng và việc soạn yêu cầu liên hệ. Không gửi giá trị biểu mẫu, tên, email, tham số hành động hoặc số tiền đến analytics. Không dùng cookie theo dõi. Nhà cung cấp hosting có thể xử lý nhật ký phân phối và bảo mật thông thường.", "已启用 Vercel Web Analytics，统计浏览量与汇总交互事件，包括模拟结果和准备联系请求。不会向分析服务发送表单值、姓名、邮箱、操作内容或交易金额。不使用追踪 Cookie。托管方可能处理常规交付与安全日志。") : body}</p></article>)}<p className="small muted">{localized(locale, "Last updated: 8 October 2026", "Cập nhật: 8 tháng 10 năm 2026", "更新日期：2026年10月8日")}</p></section>}
    </>}
  </main>;
}
