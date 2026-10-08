"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { localized, type Locale } from "@/lib/i18n";

export function GuardAnimation({ locale }: { locale: Locale }) {
  const [playing, setPlaying] = useState(true);
  const c = content[locale];
  return <figure className={`guard-visual ${playing ? "is-playing" : "is-paused"}`}>
    <div className="visual-topline"><span>{localized(locale, "Business-action verification", "业务操作验证")}</span><span className="badge">{c.status}</span></div>
    <div className="guard-flow" aria-label={c.flow.caption}>
      <svg className="flow-lines" viewBox="0 0 600 280" fill="none" aria-hidden="true">
        <path className="flow-wire" d="M75 140H285M315 140H420V65H535M420 140H535M420 140V215H535" />
        <circle className="action-packet packet-input" cx="75" cy="140" r="5" />
        <circle className="action-packet packet-allow" cx="315" cy="140" r="4" />
        <circle className="action-packet packet-approval" cx="315" cy="140" r="4" />
        <circle className="action-packet packet-block" cx="315" cy="140" r="4" />
      </svg>
      <div className="agent-node"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="6" y="9" width="20" height="17" rx="4" /><path d="M16 4v5M3 15h3M26 15h3M11 26v3M21 26v3" /><path d="M11 15h2M19 15h2M12 21h8" /></svg></div>
      <div className="policy-node"><span className="policy-node-symbol mono" aria-hidden="true">{ "{ }" }</span><strong>{localized(locale, "Business rules", "业务规则")}</strong><span>{localized(locale, "Evidence + approval", "证据与审批")}</span></div>
      <div className="flow-outcome outcome-allow"><span aria-hidden="true">✓</span>{c.flow.allow}</div>
      <div className="flow-outcome outcome-approval"><span aria-hidden="true">Ⅱ</span>{c.flow.approval}</div>
      <div className="flow-outcome outcome-block"><span aria-hidden="true">×</span>{c.flow.block}</div>
      <span className="flow-label label-agent">{c.flow.proposed}</span><span className="flow-label label-guard">{c.flow.policy}</span>
    </div>
    <div className="visual-decision"><div><span className="small muted">{c.flow.decision}</span><strong className="mono status-approval">REQUIRE_APPROVAL</strong></div><span className="decision-amount mono">USD 150<span className="muted small"> / USD 200</span></span></div>
    <div className="visual-policy"><span className="mono muted">refund.approval_threshold</span><code>USD 100</code></div>
    <figcaption><span>{c.flow.caption}</span><button className="animation-toggle" type="button" onClick={() => setPlaying(!playing)} aria-pressed={!playing} aria-label={playing ? c.flow.pause : c.flow.play}>{playing ? "Ⅱ" : "▷"}</button></figcaption>
  </figure>;
}
