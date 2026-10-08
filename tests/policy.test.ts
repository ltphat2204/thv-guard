import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluate, mockAction, mockTrustedState, MOCK_NOW, parseAmountCents,
  type ApprovalBinding, type EvaluationContext, type ProposedAction, type ReasonCode,
} from "../src/lib/policy.ts";

const action = (amountCents = 6000): ProposedAction => ({ ...mockAction, amountCents });
const approvalFor = (proposal: ProposedAction): ApprovalBinding => ({
  approvalId: "approval-test-001", action: { ...proposal }, expiresAt: "2099-01-01T00:00:00.000Z",
});
const context = (proposal = action()): EvaluationContext => ({
  action: proposal, trustedState: { ...mockTrustedState, executedActionIds: [] }, approval: null, now: MOCK_NOW,
});
const blocks = (input: EvaluationContext, reason: ReasonCode) => {
  const record = evaluate(input);
  assert.equal(record.result, "BLOCK");
  assert.ok(record.reason_codes.includes(reason), JSON.stringify(record.reason_codes));
};

test("PRD presets: 60 allow, 150 approval, 240 block, approved150 changed180 block", () => {
  assert.equal(evaluate(context(action(6000))).result, "ALLOW");
  assert.equal(evaluate(context(action(15000))).result, "REQUIRE_APPROVAL");
  blocks(context(action(24000)), "amount_exceeds_remaining");
  const original = action(15000);
  const bound = approvalFor(original);
  assert.equal(evaluate({ ...context(original), approval: bound }).result, "ALLOW");
  blocks({ ...context(action(18000)), approval: bound }, "approval_mismatch");
  assert.equal(bound.action.amountCents, 15000);
});

test("integer-cent thresholds and remaining balance are exact; approval never overrides balance", () => {
  assert.equal(evaluate(context(action(10000))).result, "ALLOW");
  assert.equal(evaluate(context(action(10001))).result, "REQUIRE_APPROVAL");
  const exactBalance = action(20000);
  assert.equal(evaluate({ ...context(exactBalance), approval: approvalFor(exactBalance) }).result, "ALLOW");
  const excessive = action(20001);
  blocks({ ...context(excessive), approval: approvalFor(excessive) }, "amount_exceeds_remaining");
  const record = evaluate(context());
  assert.equal(record.requested_amount, 60);
  assert.equal(record.remaining_refundable_balance, 200);
  assert.equal(record.trustedState?.paidAmountCents, 25000);
  assert.equal(record.trustedState?.refundedAmountCents, 5000);
});

test("approval binds amount, recipient, order, action ID, tool, agent, principal, currency and action expiry", () => {
  const original = action(15000);
  const bound = approvalFor(original);
  const changes: Partial<ProposedAction>[] = [
    { amountCents: 18000 }, { amountCents: 6000 }, { recipient: "other-recipient" },
    { orderId: "ORD-OTHER" }, { actionId: "other-action" }, { tool: "transfer_funds" },
    { agentId: "other-agent" }, { requestingPrincipal: "Other Principal" }, { currency: "SGD" },
    { expiresAt: "2098-01-01T00:00:00.000Z" },
  ];
  for (const change of changes) blocks({ ...context({ ...original, ...change }), approval: bound }, "approval_mismatch");
  // Recipient is not arbitrarily restricted to a particular original recipient; exact approval binding is the rule.
  const otherRecipient = { ...original, recipient: "another-customer" };
  assert.equal(evaluate({ ...context(otherRecipient), approval: approvalFor(otherRecipient) }).result, "ALLOW");
});

test("expired approval fails closed, including expiry equal to evaluation time", () => {
  const original = action(15000);
  for (const expiresAt of ["2020-01-01T00:00:00.000Z", new Date(MOCK_NOW).toISOString(), "not-a-date", "2099-02-30T00:00:00.000Z"]) {
    blocks({ ...context(original), approval: { ...approvalFor(original), expiresAt } }, "approval_expired");
  }
  const record = evaluate({ ...context(original), approval: { ...approvalFor(original), expiresAt: "2020-01-01T00:00:00.000Z" } });
  assert.equal(record.approval_status, "expired");
});

test("replay and unavailable trusted state cannot be authorized by approval", () => {
  const original = action(15000);
  blocks({ ...context(original), approval: approvalFor(original), trustedState: { ...mockTrustedState, executedActionIds: [original.actionId] } }, "action_replayed");
  blocks({ ...context(original), approval: approvalFor(original), trustedState: null }, "trusted_state_unavailable");
  for (const change of [
    { evidenceSource: "" }, { paidAmountCents: NaN }, { paidAmountCents: Infinity },
    { refundedAmountCents: -1 }, { refundedAmountCents: 5000.5 }, { refundedAmountCents: 25001 },
    { executedActionIds: undefined },
  ]) {
    blocks({ ...context(), trustedState: { ...mockTrustedState, ...change } as EvaluationContext["trustedState"] }, "trusted_state_unavailable");
  }
  const record = evaluate({ ...context(), trustedState: null });
  assert.equal(record.remaining_refundable_balance, null);
  assert.equal(record.checks.find((check) => check.code === "not_replayed")?.status, "skip");
});

test("unauthorized tool, wrong order, wrong currency, expired action", () => {
  blocks(context({ ...action(), tool: "transfer_funds" }), "tool_unauthorized");
  blocks(context({ ...action(), orderId: "ORD-OTHER" }), "order_mismatch");
  blocks(context({ ...action(), currency: "EUR" }), "order_mismatch");
  blocks(context({ ...action(), expiresAt: new Date(MOCK_NOW).toISOString() }), "action_expired");
  blocks(context({ ...action(), expiresAt: "2020-01-01T00:00:00.000Z" }), "action_expired");
});

test("negative, zero, non-finite, unsafe and fractional cents, missing identity, invalid clock and invalid expiry block", () => {
  for (const amount of [-1, 0, NaN, Infinity, -Infinity, 60.5, Number.MAX_SAFE_INTEGER + 1]) {
    blocks(context(action(amount)), "invalid_input");
  }
  for (const change of [{ actionId: "" }, { orderId: " " }, { recipient: "" }, { agentId: "" }, { requestingPrincipal: "" }, { expiresAt: "" }, { expiresAt: "2099-02-30T00:00:00.000Z" }]) {
    blocks(context({ ...action(), ...change }), "invalid_input");
  }
  for (const now of [NaN, Infinity, -1, MOCK_NOW + 0.5, 8_640_000_000_000_001]) blocks({ ...context(), now }, "invalid_input");
});

test("USD input parses decimal strings without fractional cent rounding", () => {
  for (const [text, cents] of [["60", 6000], ["150.00", 15000], ["0.01", 1], ["1.2", 120], ["1.01", 101], ["0.29", 29]] as const) assert.equal(parseAmountCents(text), cents);
  for (const text of ["", " ", "NaN", "Infinity", "-1", "1.001", "1e2", "1,00", "9007199254740992"]) assert.ok(Number.isNaN(parseAmountCents(text)), text);
});

test("record has every PRD field; deterministic, non-mutating and detached snapshots", () => {
  const input = context(action(15000)); input.approval = approvalFor(input.action);
  const before = structuredClone(input);
  const record = evaluate(input);
  assert.deepEqual(record, evaluate(input));
  assert.deepEqual(input, before);
  for (const key of ["decision_id", "action_id", "agent_id", "requesting_principal", "tool_name", "transaction_reference", "requested_amount", "remaining_refundable_balance", "policy_version", "approval_status", "result", "reason_codes", "evaluated_at"]) assert.ok(key in record, key);
  assert.equal(record.approval_status, "valid"); assert.equal(record.simulationOnly, true);
  assert.equal(record.currency, "USD"); assert.equal(record.transaction_reference, "ORD-2048");
  assert.equal(record.requesting_principal, "Support Agent"); assert.equal(record.tool_name, "issue_refund");
  input.action.amountCents = 18000; input.approval.action.recipient = "mutated"; input.trustedState!.executedActionIds.push("mutated");
  assert.equal(record.proposedAction.amountCents, 15000);
  assert.equal(record.approvalBinding?.action.recipient, mockAction.recipient);
  assert.deepEqual(record.trustedState?.executedActionIds, []);
});
