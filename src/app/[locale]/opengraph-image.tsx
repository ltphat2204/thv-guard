import { ImageResponse } from "next/og";
import { content } from "@/lib/content";
import { company, isLocale } from "@/lib/i18n";
export const alt = "Tuan Hung Vu Technologies Pte. Ltd. — Technology for business integrity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = content[isLocale(locale) ? locale : "en"];
  const colors = { paper: "#faf9f6", ink: "#142d46", muted: "#52616e", accent: "#c64232", rule: "#cfd5db" };
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: colors.paper, color: colors.ink, padding: "64px 72px", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}><svg width="92" height="76" viewBox="0 0 236 196"><polygon fill={colors.ink} points="20,22 116,22 132,42 80,42 80,84 58,84 58,42 20,42"/><polygon fill={colors.ink} points="28,64 50,64 50,106 92,106 108,126 50,126 50,174 28,174"/><polygon fill={colors.ink} points="92,62 114,62 114,174 92,174"/><polygon fill={colors.accent} points="120,58 144,58 162,128 192,22 216,22 174,174 150,174"/><polygon fill={colors.accent} points="92,84 114,84 114,100 92,100"/></svg><div style={{ display: "flex", flexDirection: "column", gap: 3 }}><span style={{ fontSize: 32, fontWeight: 700 }}>Tuan Hung Vu</span><span style={{ fontSize: 22, color: colors.muted }}>Technologies Pte. Ltd.</span></div><span style={{ marginLeft: "auto", color: colors.accent, fontSize: 20 }}>AI security · Business integrity</span></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 72, fontWeight: 700, letterSpacing: -3, lineHeight: 1.12 }}><span>{c.hero[0]}</span><span>{c.hero[1]}</span></div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${colors.rule}`, paddingTop: 24, color: colors.muted, fontSize: 19 }}><span>{company}</span><span>{c.status}</span></div>
  </div>, size);
}
