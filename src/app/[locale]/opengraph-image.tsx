import { ImageResponse } from "next/og";
import { content } from "@/lib/content";
import { company, isLocale } from "@/lib/i18n";
export const alt = "THV-guard — Verify the action. Not just the agent.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = content[isLocale(locale) ? locale : "en"];
  const colors = { paper: "#080d18", ink: "#f8fafc", muted: "#94a3b8", cyan: "#22d3ee", violet: "#8b5cf6", rule: "#263246" };
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: colors.paper, color: colors.ink, padding: "64px 72px", fontFamily: "sans-serif" }}><div style={{ display: "flex", alignItems: "center", gap: 20 }}><svg width="52" height="56" viewBox="0 0 52 56"><path d="M26 3 48 12 45 36 26 53 7 36 4 12Z" fill="none" stroke={colors.violet} strokeWidth="4"/><path d="m15 27 8 8 15-16" fill="none" stroke={colors.cyan} strokeWidth="4"/></svg><span style={{ fontSize: 34 }}>THV-guard</span><span style={{ marginLeft: "auto", color: colors.cyan, fontSize: 20 }}>{c.status}</span></div><div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 68, fontWeight: 700, letterSpacing: -3, lineHeight: 1.15 }}><span>{c.hero[0]}</span><span style={{ color: colors.muted }}>{c.hero[1]}</span></div><div style={{ display: "flex", borderTop: `1px solid ${colors.rule}`, paddingTop: 24, color: colors.muted, fontSize: 22 }}>{company}</div></div>, size);
}
