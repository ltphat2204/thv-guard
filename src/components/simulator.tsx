"use client";

import { useId, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { localized, type Locale } from "@/lib/i18n";
import {
  MOCK_NOW, evaluate, mockAction, mockTrustedState, parseAmountCents,
  type ApprovalBinding, type CheckCode, type DecisionRecord, type ProposedAction, type ReasonCode,
} from "@/lib/policy";

const reasons: Record<ReasonCode, [string, string, string]> = {
  invalid_input: ["Provide a positive amount in whole cents, complete action identifiers, and a valid UTC expiry.", "Nhập số tiền dương theo đơn vị xu nguyên, đầy đủ định danh hành động và thời hạn UTC hợp lệ.", "请输入以整数美分计的正数金额、完整操作标识及有效的 UTC 到期时间。"],
  trusted_state_unavailable: ["Trusted order or replay evidence is missing or invalid. Fail closed; a claimed balance is not evidence.", "Thiếu hoặc sai dữ liệu tin cậy về đơn hàng hay hành động đã dùng. Chặn an toàn; số dư tự khai không phải bằng chứng.", "可信订单或重放记录缺失或无效。默认阻止；声称的余额不构成证据。"],
  tool_unauthorized: ["This mock policy authorizes only issue_refund.", "Chính sách mô phỏng chỉ cho phép công cụ issue_refund.", "此模拟策略仅授权 issue_refund 工具。"],
  order_mismatch: ["The order or currency does not match the trusted order record.", "Đơn hàng hoặc tiền tệ không khớp bản ghi đơn hàng tin cậy.", "订单或币种与可信订单记录不匹配。"],
  amount_exceeds_remaining: ["The request exceeds the USD 200 remaining refundable balance. Approval cannot override this limit.", "Yêu cầu vượt quá số dư có thể hoàn 200 USD. Phê duyệt không thể bỏ qua giới hạn này.", "申请超过剩余可退款余额 200 美元。审批不能绕过此限制。"],
  action_expired: ["The proposed action has expired; its expiry must be later than evaluation time.", "Hành động đã hết hạn; thời hạn phải sau thời điểm đánh giá.", "拟议操作已过期；到期时间必须晚于评估时间。"],
  action_replayed: ["This action ID is already in the mock executed-action ledger. Reusing it is blocked.", "Mã hành động đã có trong sổ mô phỏng các hành động đã thực hiện. Không được dùng lại.", "此操作 ID 已在模拟执行记录中。禁止重复使用。"],
  approval_required: ["The request exceeds USD 100 but fits the remaining balance. Simulate approval, then evaluate the unchanged action.", "Yêu cầu vượt 100 USD nhưng vẫn trong số dư có thể hoàn. Mô phỏng phê duyệt, rồi đánh giá lại hành động không thay đổi.", "申请超过 100 美元但未超余额。模拟审批后，重新评估未更改的操作。"],
  approval_expired: ["The approval has expired or has an invalid expiry. It cannot authorize this action.", "Phê duyệt đã hết hạn hoặc có thời hạn không hợp lệ. Không thể dùng để cho phép hành động này.", "审批已过期或到期时间无效，不能授权此操作。"],
  approval_mismatch: ["Approval is bound to the original action ID, order, amount, recipient, tool, principal, and expiry. An edited action does not match.", "Phê duyệt gắn với mã hành động, đơn hàng, số tiền, người nhận, công cụ, chủ thể và thời hạn ban đầu. Hành động đã sửa không khớp.", "审批绑定原操作 ID、订单、金额、收款人、工具、主体及到期时间。修改后的操作不匹配。"],
  within_auto_limit: ["The request is at or below USD 100, within the remaining balance, and all required checks pass.", "Yêu cầu không vượt 100 USD, nằm trong số dư có thể hoàn và vượt qua mọi kiểm tra bắt buộc.", "申请不超过 100 美元、未超可退款余额，且所有必要检查均通过。"],
  approved_action: ["An unexpired approval matches this exact action, and all required checks pass.", "Phê duyệt còn hạn khớp chính xác hành động này và mọi kiểm tra bắt buộc đều đạt.", "有效审批与此操作完全匹配，且所有必要检查均通过。"],
};
const checkLabels: Record<CheckCode, [string, string, string]> = {
  valid_input: ["Valid amount and action context", "Số tiền và ngữ cảnh hợp lệ", "金额与操作上下文有效"],
  trusted_state: ["Trusted order and replay evidence", "Dữ liệu tin cậy về đơn hàng và hành động đã dùng", "可信订单与重放证据"],
  authorized_tool: ["Authorized tool", "Công cụ được phép", "已授权工具"],
  order_match: ["Order and currency match", "Đơn hàng và tiền tệ khớp", "订单与币种匹配"],
  remaining_balance: ["Within refundable balance", "Trong số dư có thể hoàn", "未超可退款余额"],
  action_not_expired: ["Action has not expired", "Hành động còn hạn", "操作未过期"],
  not_replayed: ["Action ID has not been used", "Mã hành động chưa được dùng", "操作 ID 未被使用"],
  approval_binding: ["Exact, unexpired approval binding", "Phê duyệt khớp chính xác và còn hạn", "审批完全匹配且未过期"],
};

export function Simulator({ locale }: { locale: Locale }) {
  const t = (en: string, vi: string, zh: string) => localized(locale, en, vi, zh);
  const id = useId();
  const [preset, setPreset] = useState("A");
  const [draft, setDraft] = useState<ProposedAction>({ ...mockAction });
  const [amount, setAmount] = useState("60.00");
  const [approval, setApproval] = useState<ApprovalBinding | null>(null);
  const [expiredApproval, setExpiredApproval] = useState(false);
  const [replayed, setReplayed] = useState(false);
  const [missingEvidence, setMissingEvidence] = useState(false);
  const [record, setRecord] = useState<DecisionRecord | null>(null);
  const [stale, setStale] = useState(false);
  const [notice, setNotice] = useState("");
  const [exportError, setExportError] = useState("");
  const action = { ...draft, amountCents: parseAmountCents(amount) };
  const trustedState = missingEvidence ? null : { ...mockTrustedState, executedActionIds: replayed ? [action.actionId] : [] };
  const effectiveApproval = approval && { ...approval, expiresAt: expiredApproval ? "2020-01-01T00:00:00.000Z" : approval.expiresAt };
  const context = { action, trustedState, approval: effectiveApproval, now: MOCK_NOW };
  const invalidAmount = !Number.isSafeInteger(action.amountCents) || action.amountCents <= 0;
  // Static render clock avoids hydration drift. Real client time is captured only on clicks.
  const canApprove = evaluate({ ...context, approval: null }).result === "REQUIRE_APPROVAL";
  const invalidate = () => {
    setStale(true); setRecord(null); setNotice(""); setExportError("");
  };
  const edit = (key: keyof ProposedAction, value: string) => {
    invalidate(); setPreset(""); setDraft((previous) => ({ ...previous, [key]: value }));
  };
  const loadPreset = (key: string) => {
    trackEvent("scenario_switched", { scenario: key, locale });
    const cents = { A: 6000, B: 15000, C: 24000, D: 18000 }[key as "A" | "B" | "C" | "D"];
    setPreset(key); setDraft({ ...mockAction, amountCents: cents }); setAmount((cents / 100).toFixed(2));
    setApproval(key === "D" ? {
      approvalId: "approval-demo-150", action: { ...mockAction, amountCents: 15000 }, expiresAt: mockAction.expiresAt,
    } : null);
    setExpiredApproval(false); setReplayed(false); setMissingEvidence(false);
    setRecord(null); setStale(Boolean(record) || stale); setNotice(""); setExportError("");
  };
  const simulateApproval = () => {
    // Binding snapshots the current proposal; editing controls never rewrites it.
    const now = Date.now();
    const current = evaluate({ ...context, approval: null, now });
    if (current.result !== "REQUIRE_APPROVAL") {
      invalidate(); setRecord(current); setStale(false); return;
    }
    invalidate(); setExpiredApproval(false);
    setApproval({ approvalId: `approval-demo-${now}`, action: { ...action }, expiresAt: new Date(now + 15 * 60_000).toISOString() });
    trackEvent("approval_simulated", { locale });
    setNotice(t("Mock approval bound. Evaluate without changing the action.", "Đã gắn phê duyệt mô phỏng. Đánh giá lại mà không sửa hành động.", "模拟审批已绑定。请评估未更改的操作。"));
  };
  const json = record ? JSON.stringify(record, null, 2) : "";
  const copy = async () => {
    if (!record) return;
    setNotice(""); setExportError("");
    try {
      await navigator.clipboard.writeText(json);
      setNotice(t("Decision record copied.", "Đã sao chép bản ghi quyết định.", "决策记录已复制。"));
    } catch {
      setExportError(t("Clipboard unavailable. Download the JSON instead.", "Không thể dùng bộ nhớ tạm. Hãy tải JSON xuống.", "剪贴板不可用，请下载 JSON。"));
    }
  };
  const download = () => {
    if (!record) return;
    let url: string | undefined;
    let link: HTMLAnchorElement | undefined;
    setNotice(""); setExportError("");
    try {
      url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      link = document.createElement("a"); link.href = url; link.download = "thv-guard-decision.json";
      document.body.appendChild(link); link.click();
      setNotice(t("JSON download requested.", "Đã yêu cầu tải JSON.", "已请求下载 JSON。"));
    } catch {
      setExportError(t("Could not prepare the download. Try copying the JSON.", "Không thể tạo bản tải xuống. Hãy thử sao chép JSON.", "无法准备下载，请尝试复制 JSON。"));
    } finally {
      link?.remove(); if (url) { const createdUrl = url; setTimeout(() => URL.revokeObjectURL(createdUrl), 1000); }
    }
  };
  const scenarios = [
    ["A", t("USD 60 · allow", "60 USD · cho phép", "60 美元 · 允许")],
    ["B", t("USD 150 · approval", "150 USD · phê duyệt", "150 美元 · 需审批")],
    ["C", t("USD 240 · block", "240 USD · chặn", "240 美元 · 阻止")],
    ["D", t("Approved 150 → changed 180", "Duyệt 150 → sửa thành 180", "审批 150 → 改为 180")],
  ];
  return (
    <div className="simulator">
      <div className="sim-controls">
        <section className="panel" aria-labelledby={`${id}-controls`}>
          <div className="panel-heading">
            <h3 id={`${id}-controls`}>{t("Propose a refund", "Đề xuất hoàn tiền", "提出退款申请")}</h3>
            <span className="badge">{t("Local simulation", "Mô phỏng cục bộ", "本地模拟")}</span>
          </div>
          <p className="muted small">{t("Fictional order ORD-2048: USD 250 paid − USD 50 already refunded = USD 200 remaining. Support Agent may use issue_refund. No refund is executed.", "Đơn hàng giả lập ORD-2048: đã trả 250 USD − đã hoàn 50 USD = còn 200 USD. Support Agent được dùng issue_refund. Không thực hiện hoàn tiền.", "虚构订单 ORD-2048：已付 250 美元 − 已退 50 美元 = 剩余 200 美元。Support Agent 可使用 issue_refund。不执行任何退款。")}</p>
          <fieldset>
            <legend>{t("Choose a scenario", "Chọn tình huống", "选择场景")}</legend>
            <div className="scenario-tabs">
              {scenarios.map(([key, label]) => <button key={key} type="button" className={`button button-secondary${preset === key ? " selected" : ""}`} aria-pressed={preset === key} onClick={() => loadPreset(key)}>{key}. {label}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t("Action context", "Ngữ cảnh hành động", "操作上下文")}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor={`${id}-amount`}>{t("Refund amount (USD)", "Số tiền hoàn (USD)", "退款金额（美元）")}</label>
                <input id={`${id}-amount`} className="input" type="number" min="0.01" step="0.01" value={amount} aria-invalid={invalidAmount} aria-describedby={invalidAmount ? `${id}-amount-error` : undefined} onChange={(event) => { invalidate(); setPreset(""); setAmount(event.target.value); }} />
              </div>
              <div className="field">
                <label htmlFor={`${id}-tool`}>{t("Tool", "Công cụ", "工具")}</label>
                <select id={`${id}-tool`} className="select" value={draft.tool} onChange={(event) => edit("tool", event.target.value)}>
                  <option value="issue_refund">issue_refund</option>
                  <option value="transfer_funds">{t("transfer_funds (unauthorized)", "transfer_funds (không được phép)", "transfer_funds（未授权）")}</option>
                </select>
              </div>
            </div>
            {invalidAmount && <p id={`${id}-amount-error`} className="form-error">{t("Enter a positive USD amount with no more than two decimal places.", "Nhập số tiền USD dương với tối đa hai chữ số thập phân.", "请输入最多两位小数的正美元金额。")}</p>}
            <div className="field-row">
              <div className="field"><label htmlFor={`${id}-order`}>{t("Order reference", "Mã đơn hàng", "订单编号")}</label><input id={`${id}-order`} className="input mono" value={draft.orderId} onChange={(event) => edit("orderId", event.target.value)} /></div>
              <div className="field"><label htmlFor={`${id}-recipient`}>{t("Recipient", "Người nhận", "收款人")}</label><input id={`${id}-recipient`} className="input" value={draft.recipient} onChange={(event) => edit("recipient", event.target.value)} /></div>
            </div>
            <div className="field"><label htmlFor={`${id}-action`}>{t("Action ID", "Mã hành động", "操作 ID")}</label><input id={`${id}-action`} className="input mono" value={draft.actionId} onChange={(event) => edit("actionId", event.target.value)} /></div>
            <div className="field"><label htmlFor={`${id}-expiry`}>{t("Action expiry (UTC ISO 8601)", "Hết hạn hành động (UTC ISO 8601)", "操作到期时间（UTC ISO 8601）")}</label><input id={`${id}-expiry`} className="input mono" value={draft.expiresAt} onChange={(event) => edit("expiresAt", event.target.value)} /></div>
          </fieldset>
          <fieldset>
            <legend>{t("Adversarial conditions", "Điều kiện đối kháng", "对抗条件")}</legend>
            <label className="checkbox-row"><input type="checkbox" checked={replayed} onChange={(event) => { invalidate(); setReplayed(event.target.checked); }} />{t("Action ID already executed (replay)", "Mã hành động đã thực hiện (phát lại)", "操作 ID 已执行（重放）")}</label>
            <label className="checkbox-row"><input type="checkbox" checked={missingEvidence} onChange={(event) => { invalidate(); setMissingEvidence(event.target.checked); }} />{t("Trusted state unavailable", "Không có trạng thái tin cậy", "可信状态不可用")}</label>
            <label className="checkbox-row"><input type="checkbox" checked={expiredApproval} disabled={!approval} onChange={(event) => { invalidate(); setExpiredApproval(event.target.checked); }} />{t("Simulate expired approval", "Mô phỏng phê duyệt hết hạn", "模拟审批过期")}</label>
          </fieldset>
          <p className="muted small">{t("Amounts up to USD 100 may pass automatically. Above USD 100 needs exact approval; above the remaining USD 200 always blocks.", "Tối đa 100 USD có thể tự động được phép. Trên 100 USD cần phê duyệt chính xác; vượt số dư 200 USD luôn bị chặn.", "不超过 100 美元可自动通过。超过 100 美元须精确审批；超过剩余 200 美元始终阻止。")}</p>
          <div className="code-toolbar">
            <button type="button" className="button button-primary" onClick={() => { trackEvent("simulation_started", { locale }); const result = evaluate({ ...context, now: Date.now() }); setRecord(result); trackEvent("simulation_completed", { decision: result.result, locale }); setStale(false); setNotice(""); setExportError(""); }}>{t("Evaluate action", "Đánh giá hành động", "评估操作")}</button>
            {canApprove && <button type="button" className="button button-secondary" onClick={simulateApproval}>{t("Simulate approval", "Mô phỏng phê duyệt", "模拟审批")}</button>}
          </div>
          <p className="muted small">{t("Controls and records stay in this browser session. This is not production enforcement, real approval, or durable replay protection.", "Dữ liệu chỉ tồn tại trong phiên trình duyệt này. Đây không phải cơ chế thực thi thực tế, phê duyệt thật hay bảo vệ phát lại bền vững.", "控件与记录仅存在于当前浏览器会话。这不是生产执行、真实审批或持久重放保护。")}</p>
        </section>
        <section className="panel" aria-labelledby={`${id}-binding`}>
          <h3 id={`${id}-binding`}>{t("Approval binding", "Ràng buộc phê duyệt", "审批绑定")}</h3>
          <p className="muted small">{approval ? t("This snapshot stays bound to the old action when you edit the proposal. Scenario D approved USD 150, then changed the request to USD 180.", "Bản chụp này giữ nguyên hành động cũ khi bạn sửa đề xuất. Tình huống D duyệt 150 USD, sau đó sửa yêu cầu thành 180 USD.", "修改申请时，此快照仍绑定旧操作。场景 D 先审批 150 美元，再将申请改为 180 美元。") : t("No mock approval exists. For a valid request above USD 100, simulate approval and evaluate again without editing.", "Chưa có phê duyệt mô phỏng. Với yêu cầu hợp lệ trên 100 USD, mô phỏng phê duyệt và đánh giá lại mà không chỉnh sửa.", "尚无模拟审批。对超过 100 美元的有效申请，模拟审批后不作更改再次评估。")}</p>
          <pre className="code-block" tabIndex={0} aria-label={t("Approval binding JSON", "JSON ràng buộc phê duyệt", "审批绑定 JSON")}>{JSON.stringify(effectiveApproval, null, 2)}</pre>
        </section>
      </div>
      <div className="sim-output">
        <section className="panel" aria-labelledby={`${id}-decision`}>
          <div className="panel-heading"><h3 id={`${id}-decision`}>{t("Policy decision", "Quyết định chính sách", "策略决策")}</h3>{record && <span className={`badge ${record.result === "ALLOW" ? "status-allow" : record.result === "BLOCK" ? "status-block" : "status-approval"}`}>{record.result === "ALLOW" ? t("Allow", "Cho phép", "允许") : record.result === "BLOCK" ? t("Block", "Chặn", "阻止") : t("Require approval", "Cần phê duyệt", "需要审批")}</span>}</div>
          <div aria-live="polite" aria-atomic="true">
            {!record && <p className={stale ? "form-error" : "muted"}>{stale ? t("Context changed. No current evaluation is valid; evaluate again. Existing approval is not transferred to an edited action.", "Ngữ cảnh đã thay đổi. Chưa có đánh giá hợp lệ hiện tại; hãy đánh giá lại. Phê duyệt hiện có không được chuyển sang hành động đã sửa.", "上下文已更改。当前没有有效评估；请重新评估。现有审批不能转用于修改后的操作。") : t("Choose a scenario and evaluate to see the decision and checks.", "Chọn tình huống và đánh giá để xem quyết định cùng các kiểm tra.", "选择场景并评估，查看决策与检查结果。")}</p>}
            {record && <ul>{record.reason_codes.map((code) => <li key={code}>{t(...reasons[code])}</li>)}</ul>}
          </div>
          {record && <ul className="check-list">{record.checks.map((check) => <li key={check.code} className={`check-row check-${check.status}`}><span>{t(...checkLabels[check.code])}</span><span className="small">{check.status === "pass" ? t("Pass", "Đạt", "通过") : check.status === "fail" ? t("Fail", "Không đạt", "失败") : t("Not applicable / unavailable", "Không áp dụng / không có dữ liệu", "不适用／不可用")}</span></li>)}</ul>}
        </section>
        <section className="panel" aria-labelledby={`${id}-action-json`}>
          <h3 id={`${id}-action-json`}>{t("Proposed action", "Hành động đề xuất", "拟议操作")}</h3>
          <pre className="code-block" tabIndex={0} aria-label={t("Proposed action JSON", "JSON hành động đề xuất", "拟议操作 JSON")}>{JSON.stringify(action, null, 2)}</pre>
        </section>
        <section className="panel" aria-labelledby={`${id}-record`}>
          <div className="panel-heading"><h3 id={`${id}-record`}>{t("Decision record", "Bản ghi quyết định", "决策记录")}</h3><span className="badge mono">JSON</span></div>
          <div className="code-toolbar"><button type="button" className="button button-secondary" disabled={!record} onClick={copy}>{t("Copy JSON", "Sao chép JSON", "复制 JSON")}</button><button type="button" className="button button-secondary" disabled={!record} onClick={download}>{t("Download JSON", "Tải JSON", "下载 JSON")}</button></div>
          <p className="small muted" role="status">{notice}</p>{exportError && <p className="form-error" role="alert">{exportError}</p>}
          {record ? <pre className="code-block" tabIndex={0} aria-label={t("Decision record JSON", "JSON bản ghi quyết định", "决策记录 JSON")}>{json}</pre> : <p className="muted small">{t("No current decision record. Evaluate first; edited context disables exports until reevaluated.", "Chưa có bản ghi quyết định hiện tại. Hãy đánh giá trước; sửa ngữ cảnh sẽ vô hiệu hóa xuất dữ liệu đến khi đánh giá lại.", "暂无当前决策记录。请先评估；上下文更改后，重新评估前无法导出。")}</p>}
        </section>
      </div>
    </div>
  );
}
