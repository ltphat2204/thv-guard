export const POLICY_VERSION = "refund-demo-v1";
export const AUTO_APPROVAL_LIMIT_CENTS = 10_000;
export const MOCK_NOW = Date.parse("2026-10-08T09:00:00.000Z");

export type ProposedAction = {
  actionId: string;
  agentId: string;
  requestingPrincipal: string;
  tool: string;
  orderId: string;
  amountCents: number;
  currency: string;
  recipient: string;
  expiresAt: string;
};

export type ApprovalBinding = {
  approvalId: string;
  action: ProposedAction;
  expiresAt: string;
};

export type TrustedState = {
  orderId: string;
  currency: string;
  paidAmountCents: number;
  refundedAmountCents: number;
  executedActionIds: string[];
  evidenceSource: string;
};

export type EvaluationContext = {
  action: ProposedAction;
  trustedState: TrustedState | null;
  approval: ApprovalBinding | null;
  now: number;
};

export type CheckCode = "valid_input" | "trusted_state" | "authorized_tool" | "order_match" | "remaining_balance" | "action_not_expired" | "not_replayed" | "approval_binding";
export type ReasonCode = "invalid_input" | "trusted_state_unavailable" | "tool_unauthorized" | "order_mismatch" | "amount_exceeds_remaining" | "action_expired" | "action_replayed" | "approval_required" | "approval_expired" | "approval_mismatch" | "within_auto_limit" | "approved_action";
export type Decision = "ALLOW" | "BLOCK" | "REQUIRE_APPROVAL";
export type PolicyCheck = { code: CheckCode; status: "pass" | "fail" | "skip" };
export type DecisionRecord = {
  decision_id: string;
  action_id: string;
  agent_id: string;
  requesting_principal: string;
  tool_name: string;
  transaction_reference: string;
  requested_amount: number;
  remaining_refundable_balance: number | null;
  currency: string;
  policy_version: string;
  approval_status: "not_required" | "missing" | "valid" | "expired" | "mismatched" | "not_evaluated";
  result: Decision;
  reason_codes: ReasonCode[];
  evaluated_at: string | null;
  proposedAction: ProposedAction;
  approvalBinding: ApprovalBinding | null;
  trustedState: TrustedState | null;
  remainingRefundableCents: number | null;
  checks: PolicyCheck[];
  simulationOnly: true;
};

export function parseAmountCents(value: string): number {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return NaN;
  const [whole, fraction = ""] = value.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : NaN;
}

const money = (value: number) => Number.isSafeInteger(value) && value >= 0;
const text = (value: string) => typeof value === "string" && value.trim().length > 0;
const timestamp = (value: string) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === (value.includes(".") ? value : value.replace("Z", ".000Z"));
};
const actionFields: (keyof ProposedAction)[] = ["actionId", "agentId", "requestingPrincipal", "tool", "orderId", "amountCents", "currency", "recipient", "expiresAt"];

export const mockAction: ProposedAction = {
  actionId: "refund-demo-001",
  agentId: "support-agent-01",
  requestingPrincipal: "Support Agent",
  tool: "issue_refund",
  orderId: "ORD-2048",
  amountCents: 6_000,
  currency: "USD",
  recipient: "customer-original-042",
  expiresAt: "2099-01-01T00:00:00.000Z",
};

export const mockTrustedState: TrustedState = {
  orderId: "ORD-2048",
  currency: "USD",
  paidAmountCents: 25_000,
  refundedAmountCents: 5_000,
  executedActionIds: [],
  evidenceSource: "local_mock_order_ledger",
};

// Pure simulation: callers supply both the clock and mock evidence; nothing is executed or persisted.
export function evaluate({ action, trustedState: state, approval, now }: EvaluationContext): DecisionRecord {
  const checks: PolicyCheck[] = [];
  const reasons: ReasonCode[] = [];
  const check = (code: CheckCode, valid: boolean | null, reason?: ReasonCode) => {
    checks.push({ code, status: valid === null ? "skip" : valid ? "pass" : "fail" });
    if (valid === false && reason) reasons.push(reason);
  };
  const validClock = Number.isSafeInteger(now) && now >= 0 && now <= 8_640_000_000_000_000;
  const validInput = money(action.amountCents) && action.amountCents > 0 &&
    [action.actionId, action.agentId, action.requestingPrincipal, action.tool, action.orderId, action.currency, action.recipient].every(text) &&
    timestamp(action.expiresAt) && validClock;
  check("valid_input", validInput, "invalid_input");
  const validState = !!state && [state.orderId, state.currency, state.evidenceSource].every(text) &&
    money(state.paidAmountCents) && money(state.refundedAmountCents) && state.refundedAmountCents <= state.paidAmountCents &&
    Array.isArray(state.executedActionIds) && state.executedActionIds.every(text);
  check("trusted_state", validState, "trusted_state_unavailable");
  check("authorized_tool", action.tool === "issue_refund", "tool_unauthorized");
  const remaining = validState && state ? state.paidAmountCents - state.refundedAmountCents : null;
  check("order_match", validState && state ? action.orderId === state.orderId && action.currency === state.currency : null, "order_mismatch");
  check("remaining_balance", validInput && remaining !== null ? action.amountCents <= remaining : null, "amount_exceeds_remaining");
  check("action_not_expired", validInput ? Date.parse(action.expiresAt) > now : null, "action_expired");
  check("not_replayed", validState && state ? !state.executedActionIds.includes(action.actionId) : null, "action_replayed");

  let approvalStatus: DecisionRecord["approval_status"] = approval ? "not_evaluated" : action.amountCents > AUTO_APPROVAL_LIMIT_CENTS ? "missing" : "not_required";
  // An existing binding is checked even below the automatic threshold: edits never silently reuse approval.
  if (approval && validInput) {
    const unexpired = text(approval.approvalId) && timestamp(approval.expiresAt) && Date.parse(approval.expiresAt) > now;
    const matches = !!approval.action && actionFields.every((field) => approval.action[field] === action[field]);
    approvalStatus = !unexpired ? "expired" : matches ? "valid" : "mismatched";
    check("approval_binding", unexpired && matches, !unexpired ? "approval_expired" : "approval_mismatch");
  } else {
    check("approval_binding", validInput && action.amountCents > AUTO_APPROVAL_LIMIT_CENTS ? false : null);
  }

  let decision: Decision = "BLOCK";
  if (!reasons.length) {
    if (approval) { decision = "ALLOW"; reasons.push("approved_action"); }
    else if (action.amountCents <= AUTO_APPROVAL_LIMIT_CENTS) { decision = "ALLOW"; reasons.push("within_auto_limit"); }
    else { decision = "REQUIRE_APPROVAL"; reasons.push("approval_required"); }
  }
  // Clone record inputs so later UI edits cannot alter an already-issued decision snapshot.
  return {
    decision_id: `demo-${action.actionId}-${validClock ? now : "invalid-time"}`,
    action_id: action.actionId,
    agent_id: action.agentId,
    requesting_principal: action.requestingPrincipal,
    tool_name: action.tool,
    transaction_reference: action.orderId,
    requested_amount: action.amountCents / 100,
    remaining_refundable_balance: remaining === null ? null : remaining / 100,
    currency: action.currency,
    policy_version: POLICY_VERSION,
    approval_status: approvalStatus,
    result: decision,
    reason_codes: reasons,
    evaluated_at: validClock ? new Date(now).toISOString() : null,
    proposedAction: { ...action },
    approvalBinding: approval ? { ...approval, action: { ...approval.action } } : null,
    trustedState: state ? { ...state, executedActionIds: Array.isArray(state.executedActionIds) ? [...state.executedActionIds] : [] } : null,
    remainingRefundableCents: remaining,
    checks,
    simulationOnly: true,
  };
}
