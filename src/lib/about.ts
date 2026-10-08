import type { Locale } from "./i18n";

const en = {
  since: "Our story · since 2023",
  title: "Business logic deserves a guard.",
  lead: "Our story began in 2023 and grew out of an AI-security hackathon in Singapore. Those Singapore roots shape the question behind THV-guard: how do we guard business logic as AI becomes capable of taking real actions?",
  companyTitle: "The company behind the solution.",
  companyBody: "Tuan Hung Vu Technologies Pte. Ltd. is a Singapore-origin startup, with roots in an AI-security hackathon held in Singapore. THV-guard is our solution: a focused exploration of how to verify an AI agent’s proposed action against the business rules, evidence, and approvals it actually requires.",
  backing: "Singapore roots · Singapore enterprise-backed.",
  storyTitle: "From business processes to business-action integrity.",
  stages: [
    {
      period: "2023",
      title: "Singapore roots. An AI-security starting point.",
      paragraphs: [
        "Our startup grew out of an AI-security hackathon in Singapore. That is our regional origin, and the starting point of this business story — not simply a market we added later.",
        "The motivation we carry into THV-guard is practical: technology should respect the way a business operates. Refunds affect customers and balances, purchase orders create obligations, and account changes can affect who receives a payment. These are business decisions, not just successful API requests.",
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
      title: "That is the reason for THV-guard.",
      paragraphs: [
        "We are exploring a guard at the business-action boundary: a place to check deterministic rules, inspect trusted transaction context, and bind required approval to the exact proposed action before execution.",
        "Our starting example is a refund workflow. It makes the distinction tangible: a permitted tool call can still exceed a balance, need human approval, or carry an approval that no longer matches its parameters.",
      ],
    },
  ],
  thesis: "An action should be valid for the business — not merely permitted by the system.",
  nextTitle: "Build the guard around real business logic.",
  nextBody: "The next step is not to add more claims to a landing page. It is to work with engineering teams on concrete policy gaps, trustworthy evidence, and the point where verification becomes execution. That includes stale state, replay, atomic execution, and paths that could bypass the guard.",
  status: "THV-guard remains a research preview. The local simulator demonstrates the idea; a production enforcement engine and real integrations are still future work.",
};

const vi: typeof en = {
  since: "Câu chuyện của chúng tôi · từ 2023",
  title: "Logic nghiệp vụ cần một lớp bảo vệ.",
  lead: "Câu chuyện của chúng tôi bắt đầu từ năm 2023 và phát triển từ một hackathon về bảo mật AI tại Singapore. Nguồn gốc Singapore định hình câu hỏi phía sau THV-guard: làm thế nào bảo vệ logic nghiệp vụ khi AI có khả năng thực hiện hành động thực tế?",
  companyTitle: "Công ty đứng sau giải pháp.",
  companyBody: "Tuan Hung Vu Technologies Pte. Ltd. là startup có nguồn gốc tại Singapore, phát triển từ một hackathon về bảo mật AI tổ chức tại Singapore. THV-guard là giải pháp nghiên cứu một bài toán cụ thể: làm thế nào kiểm chứng hành động AI agent đề xuất với đúng quy tắc nghiệp vụ, bằng chứng và phê duyệt mà hành động đó yêu cầu.",
  backing: "Khởi nguồn tại Singapore · được doanh nghiệp Singapore tài trợ.",
  storyTitle: "Từ quy trình nghiệp vụ đến tính toàn vẹn hành động.",
  stages: [
    {
      period: "2023",
      title: "Khởi nguồn tại Singapore. Bắt đầu từ bảo mật AI.",
      paragraphs: [
        "Startup của chúng tôi phát triển từ một hackathon về bảo mật AI tại Singapore. Đó là nguồn gốc khu vực và điểm bắt đầu câu chuyện kinh doanh — không chỉ là thị trường bổ sung về sau.",
        "Động lực chúng tôi đưa vào THV-guard rất thực tế: công nghệ phải tôn trọng cách doanh nghiệp vận hành. Hoàn tiền tác động đến khách hàng và số dư, đơn mua hàng tạo nghĩa vụ, thay đổi tài khoản có thể đổi người nhận thanh toán. Đây là quyết định nghiệp vụ, không chỉ là yêu cầu API thành công.",
      ],
    },
    {
      period: "Động lực",
      title: "AI thay đổi người thực hiện. Không thay đổi quy tắc.",
      paragraphs: [
        "AI agent có thể làm nhiều hơn trả lời câu hỏi: đề xuất hoàn tiền, sửa gói dịch vụ, cập nhật hồ sơ và gọi công cụ có tác động thực tế. Nhưng quyền gọi công cụ không chứng minh mọi giao dịch qua công cụ đều hợp lệ.",
        "Ai duyệt số tiền? Phê duyệt có áp dụng cho đúng người nhận? Đơn hàng đã thay đổi chưa? Hành động đó đã được thực hiện chưa? Những câu hỏi này thuộc về nghiệp vụ, dù người khởi tạo là con người, dịch vụ hay AI agent.",
      ],
    },
    {
      period: "Hôm nay",
      title: "Đó là lý do có THV-guard.",
      paragraphs: [
        "Chúng tôi nghiên cứu lớp bảo vệ tại ranh giới hành động nghiệp vụ: nơi kiểm tra quy tắc xác định, xem ngữ cảnh giao dịch đáng tin và gắn phê duyệt bắt buộc với chính xác hành động đề xuất trước khi thực thi.",
        "Ví dụ đầu tiên là quy trình hoàn tiền. Nó làm rõ sự khác biệt: một lệnh gọi công cụ được phép vẫn có thể vượt số dư, cần phê duyệt của con người hoặc mang phê duyệt không còn khớp tham số.",
      ],
    },
  ],
  thesis: "Hành động phải đúng với nghiệp vụ — không chỉ được hệ thống cho phép.",
  nextTitle: "Xây lớp bảo vệ từ logic nghiệp vụ thực tế.",
  nextBody: "Bước tiếp theo không phải thêm lời hứa vào landing page. Đó là làm việc với nhóm kỹ thuật về khoảng trống chính sách cụ thể, bằng chứng đáng tin và điểm kiểm chứng chuyển thành thực thi. Điều này bao gồm trạng thái lỗi thời, phát lại, thực thi nguyên tử và các đường đi có thể bỏ qua lớp bảo vệ.",
  status: "THV-guard vẫn là bản nghiên cứu. Bộ mô phỏng cục bộ minh họa ý tưởng; engine thực thi production và tích hợp thật vẫn là công việc tương lai.",
};

const zh: typeof en = {
  since: "我们的故事 · 始于 2023",
  title: "业务逻辑也需要一道守护边界。",
  lead: "我们的故事始于 2023 年，并从新加坡的一场 AI 安全黑客松中成长起来。新加坡的根源塑造了 THV-guard 背后的问题：当 AI 能够执行真实操作时，如何守护业务逻辑？",
  companyTitle: "解决方案背后的公司。",
  companyBody: "Tuan Hung Vu Technologies Pte. Ltd. 是一家起源于新加坡的初创公司，源自当地举办的一场 AI 安全黑客松。THV-guard 是我们的解决方案，探索如何根据实际需要的业务规则、证据和审批，验证 AI 智能体提出的操作。",
  backing: "起源于新加坡 · 获新加坡企业资助。",
  storyTitle: "从业务流程，到业务操作的完整性。",
  stages: [
    {
      period: "2023",
      title: "根在新加坡，起点是 AI 安全。",
      paragraphs: [
        "我们的初创公司从新加坡的一场 AI 安全黑客松中成长起来。新加坡是我们的地域起源，也是商业故事的起点，而不只是后来拓展的市场。",
        "我们带入 THV-guard 的动力很务实：技术应尊重企业的运作方式。退款影响客户和余额，采购订单产生义务，账户变更可能改变付款接收方。这些都是业务决策，而不只是成功的 API 请求。",
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
      title: "这就是 THV-guard 的出发点。",
      paragraphs: [
        "我们探索业务操作边界上的守护层：在执行前检查确定性规则、核对可信交易上下文，并将所需审批绑定到确切的拟议操作。",
        "第一个示例是退款流程。它清楚地展示：获准的工具调用仍可能超过余额、需要人工审批，或携带与当前参数不再匹配的审批。",
      ],
    },
  ],
  thesis: "操作必须符合业务逻辑，而不只是获得系统许可。",
  nextTitle: "围绕真实业务逻辑建立守护层。",
  nextBody: "下一步不是为落地页添加更多承诺，而是与工程团队研究具体策略缺口、可信证据，以及验证转变为执行的边界。这包括过期状态、重放、原子执行，以及可能绕过守护层的路径。",
  status: "THV-guard 仍处于研究预览阶段。本地模拟器展示概念；生产执行引擎和真实集成仍待开发。",
};

export const about: Record<Locale, typeof en> = { en, vi, zh };
