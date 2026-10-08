"use client";

import { useRef, useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import { company, contactEmail, localized, mailLink, type Locale } from "@/lib/i18n";

type Choice = readonly [value: string, en: string, vi: string, zh: string];
const modes: readonly Choice[] = [
  ["demo", "Book demo", "Đặt lịch demo", "预约演示"],
  ["sales", "Contact sales", "Liên hệ bán hàng", "联系销售"],
  ["partner", "Design partner", "Đối tác đồng thiết kế", "共同设计合作伙伴"],
];
const roles: readonly Choice[] = [
  ["cto", "CTO", "CTO", "首席技术官"],
  ["founder", "Founder / executive", "Nhà sáng lập / lãnh đạo", "创始人 / 高管"],
  ["engineering", "Engineering leader", "Quản lý kỹ thuật", "工程负责人"],
  ["developer", "AI engineer", "Kỹ sư AI", "AI 工程师"],
  ["security", "Security / compliance", "Bảo mật / tuân thủ", "安全 / 合规"],
  ["operations", "Product / operations", "Sản phẩm / vận hành", "产品 / 运营"],
  ["other", "Other", "Khác", "其他"],
];
const maturities: readonly Choice[] = [
  ["exploring", "Exploring", "Đang nghiên cứu", "探索阶段"],
  ["prototype", "Prototype", "Nguyên mẫu", "原型阶段"],
  ["staging", "Staging", "Môi trường staging", "预生产阶段"],
  ["production", "Production", "Đang vận hành thực tế", "生产阶段"],
];
const runtimes: readonly Choice[] = [
  ["langchain", "LangChain", "LangChain", "LangChain"],
  ["langgraph", "LangGraph", "LangGraph", "LangGraph"],
  ["openai", "OpenAI Agents SDK", "OpenAI Agents SDK", "OpenAI Agents SDK"],
  ["bedrock", "Amazon Bedrock", "Amazon Bedrock", "Amazon Bedrock"],
  ["microsoft", "Microsoft", "Microsoft", "Microsoft"],
  ["autogen", "AutoGen", "AutoGen", "AutoGen"],
  ["crewai", "CrewAI", "CrewAI", "CrewAI"],
  ["custom", "Custom runtime", "Môi trường tự xây dựng", "自建运行时"],
  ["other", "Other / undecided", "Khác / chưa quyết định", "其他 / 尚未确定"],
];
const actions: readonly Choice[] = [
  ["refund", "Issue refunds", "Hoàn tiền", "发起退款"],
  ["procurement", "Create purchase orders", "Tạo đơn mua hàng", "创建采购订单"],
  ["subscription", "Modify subscriptions / issue credits", "Sửa gói dịch vụ / cấp tín dụng", "修改订阅 / 发放额度"],
  ["http", "External API / HTTP calls", "Gọi API / HTTP bên ngoài", "外部 API / HTTP 调用"],
  ["database", "Database reads / writes", "Đọc / ghi cơ sở dữ liệu", "数据库读写"],
  ["crm", "CRM / business system updates", "Cập nhật CRM / hệ thống nghiệp vụ", "更新 CRM / 业务系统"],
  ["cloud", "Cloud / infrastructure changes", "Thay đổi đám mây / hạ tầng", "云服务 / 基础设施变更"],
  ["execution", "Code / shell execution", "Thực thi mã / lệnh shell", "执行代码 / shell 命令"],
  ["data", "Sensitive data access", "Truy cập dữ liệu nhạy cảm", "访问敏感数据"],
  ["other", "Other actions", "Hành động khác", "其他操作"],
];
const controls: readonly Choice[] = [
  ["policy", "Allow / block policies", "Chính sách cho phép / chặn", "允许 / 阻止策略"],
  ["approval", "Human approval", "Phê duyệt của con người", "人工审批"],
  ["binding", "Bind approval to exact parameters", "Gắn phê duyệt đúng tham số", "将审批绑定确切参数"],
  ["state", "Verify transaction state / prevent replay", "Xác minh trạng thái / chống phát lại", "验证交易状态 / 防止重放"],
  ["privacy", "Privacy / personal data", "Quyền riêng tư / dữ liệu cá nhân", "隐私 / 个人数据"],
  ["budget", "Budgets / quotas", "Ngân sách / hạn mức", "预算 / 配额"],
  ["audit", "Audit evidence", "Bằng chứng kiểm toán", "审计证据"],
  ["consistency", "Consistent controls across agents", "Kiểm soát nhất quán giữa các tác tử", "跨智能体的一致控制"],
  ["other", "Other controls", "Biện pháp kiểm soát khác", "其他控制措施"],
];

const pilotOptions: readonly Choice[] = [
  ["yes", "Yes", "Có", "是"],
  ["maybe", "Maybe", "Có thể", "可能"],
  ["no", "No", "Không", "否"],
];

function copy(locale: Locale) {
  const t = (en: string, vi: string, zh: string) => localized(locale, en, vi, zh);
  return {
    mode: t("Request type", "Loại yêu cầu", "请求类型"),
    name: t("Full name", "Họ và tên", "姓名"),
    email: t("Work email", "Email công việc", "工作邮箱"),
    company: t("Company", "Công ty", "公司"),
    role: t("Role", "Vai trò", "职位"),
    maturity: t("Agent maturity", "Mức độ triển khai tác tử", "智能体部署阶段"),
    runtime: t("Runtime / framework (optional)", "Môi trường / framework (không bắt buộc)", "运行时 / 框架（选填）"),
    actions: t("Which actions should agents take?", "Tác tử cần thực hiện những hành động nào?", "智能体需要执行哪些操作？"),
    controls: t("Which controls are hardest today?", "Biện pháp kiểm soát nào khó thực hiện nhất hiện nay?", "目前哪些控制措施最难实现？"),
    useCase: t("Concrete use case (optional)", "Tình huống sử dụng cụ thể (không bắt buộc)", "具体使用场景（选填）"),
    pilot: t("Would you consider a paid pilot? (optional; not a commitment)", "Bạn có cân nhắc pilot trả phí? (tùy chọn; không cam kết mua)", "是否考虑付费试点？（选填；不构成承诺）"),
    consent: t(`I agree to share these details with ${company} and be contacted about this request.`, `Tôi đồng ý chia sẻ thông tin này với ${company} và được liên hệ về yêu cầu này.`, `我同意向 ${company} 分享这些信息，并就此请求接受联系。`),
    choose: t("Select an option", "Chọn một mục", "请选择"),
    required: t("Required", "Bắt buộc", "必填"),
    selectMany: t("Select at least one; multiple choices allowed.", "Chọn ít nhất một mục; có thể chọn nhiều mục.", "请至少选择一项；可多选。"),
    invalid: t("Please check required fields, email format, and length limits. Select at least one action and one control, and confirm consent.", "Vui lòng kiểm tra các mục bắt buộc, định dạng email và giới hạn độ dài. Chọn ít nhất một hành động, một biện pháp kiểm soát và xác nhận đồng ý.", "请检查必填项、邮箱格式和长度限制。至少选择一项操作和一项控制措施，并确认同意。"),
    prepared: t("Request prepared — not sent or received. Your email app may open; you must send the message yourself. If nothing opens, copy the request below and email it directly.", "Đã soạn yêu cầu — chưa gửi hoặc được tiếp nhận. Ứng dụng email có thể mở; bạn phải tự gửi thư. Nếu không có ứng dụng nào mở, hãy sao chép yêu cầu bên dưới và gửi email trực tiếp.", "请求已准备好 — 尚未发送或接收。邮箱应用可能会打开；您必须自行发送邮件。如果没有打开任何应用，请复制下方请求并直接发送邮件。"),
    mailError: t("Your email app could not be opened. Copy the request below and email it directly; nothing has been sent.", "Không thể mở ứng dụng email. Hãy sao chép yêu cầu bên dưới và gửi email trực tiếp; chưa có thông tin nào được gửi.", "无法打开邮箱应用。请复制下方请求并直接发送邮件；尚未发送任何信息。"),
    clipboardError: t("Copy was unavailable. Select and copy the request below manually; nothing has been sent.", "Không thể sao chép tự động. Hãy chọn và sao chép yêu cầu bên dưới thủ công; chưa có thông tin nào được gửi.", "无法自动复制。请手动选择并复制下方请求；尚未发送任何信息。"),
    copied: t("Copied to clipboard — not sent. Paste it into an email and send it yourself.", "Đã sao chép — chưa gửi. Hãy dán vào email và tự gửi thư.", "已复制到剪贴板 — 尚未发送。请粘贴到邮件中并自行发送。"),
    subject: t("Subject", "Tiêu đề", "主题"),
    recipient: t("To", "Gửi đến", "收件人"),
    yes: t("Yes", "Có", "是"),
    unspecified: t("Not specified", "Chưa cung cấp", "未填写"),
  };
}

// The compose boundary is still untrusted: validate FormData, not just native controls.
export function buildContactRequest(data: FormData, locale: Locale): { error: string } | { subject: string; body: string; request: string; href: string } {
  const text = copy(locale);
  const errors: string[] = [];
  const label = (choice: Choice) => localized(locale, choice[1], choice[2], choice[3]);
  const single = (key: string, field: string, min: number, max: number, multiline = false) => {
    const entries = data.getAll(key);
    const raw = entries.length === 1 && typeof entries[0] === "string" ? entries[0] : "";
    const value = raw.replace(/\r\n?/g, "\n").trim();
    const checked = multiline ? raw.replace(/[\r\n\t]/g, "") : raw;
    if (entries.length > 1 || (entries.length === 1 && typeof entries[0] !== "string") || value.length < min || value.length > max || /[\p{Cc}\p{Cs}]/u.test(checked)) errors.push(field);
    return value;
  };
  const choice = (key: string, field: string, options: readonly Choice[], required = true) => {
    const value = single(key, field, required ? 1 : 0, 40);
    const selected = options.find((option) => option[0] === value);
    if (!selected && (required || value)) errors.push(field);
    return selected ? label(selected) : text.unspecified;
  };
  const many = (key: string, field: string, options: readonly Choice[]) => {
    const values = data.getAll(key);
    if (!values.length || values.length > options.length || new Set(values).size !== values.length || values.some((value) => typeof value !== "string" || !options.some((option) => option[0] === value))) errors.push(field);
    return options.filter((option) => values.includes(option[0])).map(label).join(", ");
  };
  const mode = choice("mode", text.mode, modes);
  const name = single("fullName", text.name, 2, 100);
  const email = single("email", text.email, 3, 254);
  const emailLocal = email.split("@")[0];
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email) || emailLocal.startsWith(".") || emailLocal.endsWith(".") || emailLocal.includes("..")) errors.push(text.email);
  const organization = single("company", text.company, 2, 160);
  const role = choice("role", text.role, roles);
  const maturity = choice("maturity", text.maturity, maturities);
  const runtime = choice("runtime", text.runtime, runtimes, false);
  const selectedActions = many("actions", text.actions, actions);
  const selectedControls = many("controls", text.controls, controls);
  const useCase = single("useCase", text.useCase, 0, 2000, true);
  const pilot = choice("pilot", text.pilot, pilotOptions, false);
  const consent = data.getAll("consent");
  if (consent.length !== 1 || consent[0] !== "yes") errors.push(text.consent);
  if (errors.length) return { error: `${text.invalid} (${[...new Set(errors)].join("; ")})` };
  const subject = `THV-guard — ${mode}`; // No user-entered values in email headers.
  const body = [
    `${text.mode}: ${mode}`, `${text.name}: ${name}`, `${text.email}: ${email}`,
    `${text.company}: ${organization}`, `${text.role}: ${role}`, `${text.maturity}: ${maturity}`,
    `${text.runtime}: ${runtime}`, `${text.actions}: ${selectedActions}`, `${text.controls}: ${selectedControls}`,
    `${text.useCase}:\n${useCase || text.unspecified}`, `${text.pilot}: ${pilot}`,
    `${text.consent}: ${text.yes}`,
  ].join("\n\n");
  return { subject, body, href: mailLink(subject, body), request: `${text.recipient}: ${contactEmail}\n${text.subject}: ${subject}\n\n${body}` };
}

export function ContactForm({ locale }: { locale: Locale }) {
  const text = copy(locale);
  const t = (en: string, vi: string, zh: string) => localized(locale, en, vi, zh);
  const [mode, setMode] = useState("demo");
  const [error, setError] = useState("");
  const [request, setRequest] = useState("");
  const [status, setStatus] = useState("");
  const fallback = useRef<HTMLTextAreaElement>(null);
  const label = (choice: Choice) => t(choice[1], choice[2], choice[3]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setRequest("");
    const result = buildContactRequest(new FormData(event.currentTarget), locale);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setRequest(result.request);
    setStatus(text.prepared);
    trackEvent("contact_prepared", { mode, locale });
    // ponytail: mailto cannot confirm handler availability or delivery; keep manual fallback visible.
    try { window.location.href = result.href; } catch { setError(text.mailError); }
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(request);
      setError("");
      setStatus(text.copied);
    } catch {
      setError(text.clipboardError);
      fallback.current?.focus();
      fallback.current?.select();
    }
  }

  function selectField(name: string, title: string, options: readonly Choice[], required = true) {
    return <div className="field">
      <label htmlFor={`contact-${name}`}>{title}{required ? ` (${text.required})` : ""}</label>
      <select id={`contact-${name}`} name={name} required={required} defaultValue="" className="select">
        <option value="">{text.choose}</option>
        {options.map((option) => <option key={option[0]} value={option[0]}>{label(option)}</option>)}
      </select>
    </div>;
  }

  function choiceField(name: string, title: string, options: readonly Choice[]) {
    return <fieldset className="field" aria-describedby={`contact-${name}-hint`}>
      <legend>{title} ({text.required})</legend>
      <p id={`contact-${name}-hint`} className="small muted">{text.selectMany}</p>
      <div className="choice-grid">{options.map((option) => <label key={option[0]} className="checkbox-row">
        <input type="checkbox" name={name} value={option[0]} /> <span>{label(option)}</span>
      </label>)}</div>
    </fieldset>;
  }

  return <form className="contact-form panel" action={`mailto:${contactEmail}`} method="post" encType="text/plain" onSubmit={submit} onInvalidCapture={() => { setError(text.invalid); setRequest(""); setStatus(""); }} onChange={() => { setError(""); setRequest(""); setStatus(""); }} aria-describedby="contact-intro contact-errors">
    <div className="form-intro" id="contact-intro">
      <h2>{t("Start with your real use case", "Bắt đầu từ tình huống thực tế của bạn", "从您的真实使用场景开始")}</h2>
      <p className="muted">{t("This research preview prepares an email to our team. It does not send or store your request. You choose whether to send it in your own email app.", "Bản xem trước nghiên cứu này soạn email gửi đến nhóm chúng tôi. Trang không gửi hoặc lưu yêu cầu. Bạn tự quyết định gửi thư trong ứng dụng email của mình.", "此研究预览会为您准备一封给我们团队的邮件，不会发送或存储您的请求。您可自行决定是否在邮箱应用中发送。")}</p>
      <p className="small muted">{t("Do not include credentials, personal customer data, or confidential payloads. Required fields are marked; use case is limited to 2,000 characters.", "Không cung cấp thông tin đăng nhập, dữ liệu cá nhân của khách hàng hoặc nội dung bí mật. Các mục bắt buộc được đánh dấu; tình huống sử dụng tối đa 2.000 ký tự.", "请勿提供凭据、客户个人数据或机密内容。必填项已标明；使用场景最多 2,000 个字符。")}</p>
    </div>
    <fieldset className="field">
      <legend>{text.mode} ({text.required})</legend>
      <div className="contact-modes">{modes.map((option) => <label key={option[0]} className={`button button-secondary${mode === option[0] ? " selected" : ""}`}>
        <input type="radio" name="mode" value={option[0]} checked={mode === option[0]} onChange={() => setMode(option[0])} required /> {label(option)}
      </label>)}</div>
    </fieldset>
    <div className="field-row">
      <label className="field" htmlFor="contact-name"><span>{text.name} ({text.required})</span><input className="input" id="contact-name" name="fullName" autoComplete="name" required minLength={2} maxLength={100} /></label>
      <label className="field" htmlFor="contact-email"><span>{text.email} ({text.required})</span><input className="input" id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    </div>
    <label className="field" htmlFor="contact-company"><span>{text.company} ({text.required})</span><input className="input" id="contact-company" name="company" autoComplete="organization" required minLength={2} maxLength={160} /></label>
    <div className="field-row">{selectField("role", text.role, roles)}{selectField("maturity", text.maturity, maturities)}</div>
    {selectField("runtime", text.runtime, runtimes, false)}
    {choiceField("actions", text.actions, actions)}
    {choiceField("controls", text.controls, controls)}
    <label className="field" htmlFor="contact-use-case"><span>{text.useCase}</span><textarea className="input" id="contact-use-case" name="useCase" rows={4} maxLength={2000} /></label>
    {selectField("pilot", text.pilot, pilotOptions, false)}
    <label className="checkbox-row"><input type="checkbox" name="consent" value="yes" required /><span>{text.consent} ({text.required})</span></label>
    <p id="contact-errors" className="form-error" role="alert" aria-live="assertive">{error}</p>
    <p className="form-success" role="status" aria-live="polite">{status}</p>
    <button className="button button-primary" type="submit">{t("Prepare email request", "Soạn email yêu cầu", "准备请求邮件")}</button>
    <p className="small muted">{t("Always available: email us directly at", "Luôn có thể gửi email trực tiếp đến", "您也可随时直接发送邮件至")} <a className="mono" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
    {request && <div className="field">
      <label htmlFor="contact-request">{t("Your prepared request — not sent", "Yêu cầu đã soạn — chưa gửi", "已准备的请求 — 尚未发送")}</label>
      <textarea ref={fallback} id="contact-request" className="input mono" value={request} readOnly rows={12} />
      <button type="button" className="button button-secondary" onClick={copyRequest}>{t("Copy request", "Sao chép yêu cầu", "复制请求")}</button>
    </div>}
  </form>;
}
