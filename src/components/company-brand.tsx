import Image from "next/image";
import Link from "next/link";
import { company, type Locale } from "@/lib/i18n";

export function CompanyBrand({ locale }: { locale: Locale }) {
  return <Link className="wordmark company-wordmark" href={`/${locale}`} aria-label={company}>
    <Image src="/brand/company-mark.svg" width={48} height={40} alt="" />
    <span className="company-lockup"><strong>Tuan Hung Vu</strong><span>Technologies Pte. Ltd.</span></span>
  </Link>;
}
