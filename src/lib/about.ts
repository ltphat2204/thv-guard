import type { Locale } from "./i18n";

const en = {
  since: "Our story · since 2023",
  title: "Built around business integrity.",
  lead: "The story of Tuan Hung Vu Technologies Pte. Ltd. began in 2023 and grew out of an AI-security hackathon in Singapore. Those roots shape our question: how do we protect business logic as AI becomes capable of taking real actions?",
  companyTitle: "What we are building.",
  companyBody: "We are a technology company exploring AI security and business-action integrity. Our current research asks how to verify an AI agent’s proposed action against the business rules, evidence, and approvals it actually requires.",
  backing: "Business-first. Evidence-driven.",
  storyTitle: "From business processes to business-action integrity.",
  stages: [
    {
      period: "2023",
      title: "An AI-security starting point.",
      paragraphs: [
        "Our work grew out of an AI-security hackathon. It prompted a practical question: how can automation respect the business rules behind each action?",
        "Our motivation is practical: technology should respect the way a business operates. Refunds affect customers and balances, purchase orders create obligations, and account changes can affect who receives a payment. These are business decisions, not just successful API requests.",
      ],
    },
    {
      period: "The motivation",
      title: "AI changes the actor. Not the rules.",
      paragraphs: [
        "AI agents can now do more than answer questions. They can propose refunds, change subscriptions, update records, and call tools that affect the real world. But permission to call a tool does not establish that every transaction through that tool is valid.",
        "Who approved the amount? Does that approval apply to this recipient? Has the order changed? Was the same action already executed? Those questions belong to the business, regardless of whether a person, a service, or an AI agent initiates the action.",
      ],
    },
    {
      period: "Today",
      title: "From the question to a working preview.",
      paragraphs: [
        "We are exploring business-action verification: a place to check deterministic rules, inspect trusted transaction context, and bind required approval to the exact proposed action before execution.",
        "Our starting example is a refund workflow. It makes the distinction tangible: a permitted tool call can still exceed a balance, need human approval, or carry an approval that no longer matches its parameters.",
      ],
    },
  ],
  thesis: "An action should be valid for the business — not merely permitted by the system.",
  nextTitle: "Build verification around real business logic.",
  nextBody: "The next step is not to add more claims to a landing page. It is to work with engineering teams on concrete policy gaps, trustworthy evidence, and the point where verification becomes execution. That includes stale state, replay, atomic execution, and paths that could bypass verification.",
  status: "Our business-action verification work remains a research preview. The local simulator demonstrates the idea; a production enforcement engine and real integrations are still future work.",
};

const zh: typeof en = {
  since: "我们的故事 · 始于 2023",
  title: "以业务完整性为出发点。",
  lead: "Tuan Hung Vu Technologies Pte. Ltd. 的故事始于 2023 年，并从新加坡的一场 AI 安全黑客松中成长起来。这些根源塑造了我们的思考：当 AI 能够执行真实操作时，如何保护业务逻辑？",
  companyTitle: "我们正在探索什么。",
  companyBody: "我们是一家探索 AI 安全与业务操作完整性的科技公司。目前的研究聚焦于如何根据实际需要的业务规则、证据和审批，验证 AI 智能体提出的操作。",
  backing: "以业务为先，以证据为依据。",
  storyTitle: "从业务流程，到业务操作的完整性。",
  stages: [
    {
      period: "2023",
      title: "从 AI 安全出发。",
      paragraphs: [
        "我们的工作起于一场 AI 安全黑客松。一个务实的问题由此成为关注点：如何让自动化遵守每项操作背后的业务规则？",
        "我们的动力很务实：技术应尊重企业的运作方式。退款影响客户和余额，采购订单产生义务，账户变更可能改变付款接收方。这些都是业务决策，而不只是成功的 API 请求。",
      ],
    },
    {
      period: "动力",
      title: "AI 改变执行者，不改变规则。",
      paragraphs: [
        "AI 智能体不再只是回答问题，它们可以提出退款、修改订阅、更新记录，并调用影响现实世界的工具。但调用工具的权限，并不能证明通过该工具进行的每笔交易都有效。",
        "谁批准了金额？审批适用于这个收款人吗？订单状态是否已变化？同一操作是否已执行？无论发起者是人、服务还是 AI 智能体，这些问题都属于业务本身。",
      ],
    },
    {
      period: "今天",
      title: "从问题出发，走向可运行的预览。",
      paragraphs: [
        "我们探索业务操作验证：在执行前检查确定性规则、核对可信交易上下文，并将所需审批绑定到确切的拟议操作。",
        "第一个示例是退款流程。它清楚地展示：获准的工具调用仍可能超过余额、需要人工审批，或携带与当前参数不再匹配的审批。",
      ],
    },
  ],
  thesis: "操作必须符合业务逻辑，而不只是获得系统许可。",
  nextTitle: "围绕真实业务逻辑建立验证机制。",
  nextBody: "下一步不是为落地页添加更多承诺，而是与工程团队研究具体策略缺口、可信证据，以及验证转变为执行的边界。这包括过期状态、重放、原子执行，以及可能绕过验证的路径。",
  status: "我们的业务操作验证研究仍处于预览阶段。本地模拟器展示概念；生产执行引擎和真实集成仍待开发。",
};

export const about: Record<Locale, typeof en> = { en, zh };
