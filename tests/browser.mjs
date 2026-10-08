import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await mkdir("artifacts/screenshots", { recursive: true });
const routes = ["", "product", "simulator", "architecture", "pricing", "about", "contact", "privacy"];
const locales = ["en", "vi", "zh"];

try {
  assert.equal((await page.goto(base))?.status(), 200);
  await page.waitForURL(`${base}/en`);
  for (const locale of locales) {
    for (const route of routes) {
      const url = `${base}/${locale}${route ? `/${route}` : ""}`;
      assert.equal((await page.goto(url))?.status(), 200, url);
      assert.equal(await page.locator("html").getAttribute("lang"), locale === "zh" ? "zh-Hans" : locale);
      assert.equal(await page.locator("h1").count(), 1);
      const canonicalBase = process.env.TEST_CANONICAL_ORIGIN || "http://localhost:3000";
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `${canonicalBase}/${locale}${route ? `/${route}` : ""}`);
      assert.equal(await page.locator('link[hreflang="x-default"]').count(), 1);
      assert.equal(await page.locator('link[hreflang="zh-Hans"]').count(), 1);
      assert.equal(await page.locator('script[type="application/ld+json"]').count(), 1);
      if (route === "about") {
        assert.equal(await page.locator(".about-period").first().textContent(), "2023");
        assert.equal(await page.locator(".about-chapters article").count(), 3);
        const origin = await page.locator(".about-chapters article").first().textContent();
        assert.ok(origin.includes(locale === "zh" ? "新加坡" : "Singapore"));
        assert.ok(origin.includes({ en: "AI-security hackathon", vi: "hackathon về bảo mật AI", zh: "AI 安全黑客松" }[locale]));
        assert.equal(await page.locator(".about-company-name").textContent(), "Tuan Hung Vu Technologies Pte. Ltd.");
        const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
        assert.ok(schema["@graph"].some((entity) => entity["@type"] === "AboutPage"));
        assert.equal(schema["@graph"].find((entity) => entity["@type"] === "Organization").foundingDate, undefined);
      }
      if (route === "" || route === "pricing") {
        assert.equal((await page.locator(".plan-price").first().textContent()).trim(), "$0 SGD");
        assert.ok((await page.locator(".plan-price").nth(1).textContent()).startsWith("$249 SGD"));
        assert.equal(await page.locator(".plan-price.mono").count(), 0);
      }
      for (const width of [320, 375, 414, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        assert.equal(overflow, false, `Horizontal overflow: ${url} at ${width}px`);
        if ((route === "" || route === "product") && width === 1440) {
          const policyCard = await page.locator(".feature-0").boundingBox();
          const policyCopy = await page.locator(".feature-0 > p").boundingBox();
          const policyCode = await page.locator(".feature-0 .feature-code").boundingBox();
          assert.ok(policyCard.height < 340, `Policy card should not stretch across two rows: ${url}`);
          assert.ok(policyCode.x > policyCopy.x + policyCopy.width, `Policy example should sit beside the copy: ${url}`);
        }
      }
    }
  }
  console.log(`PASS: all ${routes.length * locales.length} localized pages, About story/schema, SSR metadata, and five viewport widths`);
  assert.equal((await page.goto(`${base}/fr`))?.status(), 404);
  assert.equal((await page.goto(`${base}/en/not-a-page`))?.status(), 404);
  assert.equal((await context.request.get(`${base}/sitemap.xml`)).status(), 200);
  assert.equal((await context.request.get(`${base}/robots.txt`)).status(), 200);
  for (const locale of locales) assert.equal((await context.request.get(`${base}/${locale}/opengraph-image`)).status(), 200);
  console.log("PASS: unsupported routes, sitemap, robots, and localized social images");

  await page.goto(`${base}/en/simulator`);
  const evaluate = page.getByRole("button", { name: "Evaluate action", exact: true });
  const decision = page.getByLabel("Decision record JSON", { exact: true });
  const outcome = async (expected, code) => {
    await evaluate.click();
    const record = JSON.parse(await decision.textContent());
    assert.equal(record.result, expected);
    if (code) assert.ok(record.reason_codes.includes(code));
    return record;
  };
  await outcome("ALLOW", "within_auto_limit");
  await page.getByRole("button", { name: /^B\./ }).click();
  await outcome("REQUIRE_APPROVAL", "approval_required");
  await page.getByRole("button", { name: "Simulate approval", exact: true }).click();
  await outcome("ALLOW", "approved_action");
  await page.getByLabel("Refund amount (USD)", { exact: true }).fill("180");
  assert.equal(await decision.count(), 0, "Edited context must invalidate old decision");
  await outcome("BLOCK", "approval_mismatch");
  await page.getByRole("button", { name: /^C\./ }).click();
  await outcome("BLOCK", "amount_exceeds_remaining");
  await page.getByRole("button", { name: /^D\./ }).click();
  await outcome("BLOCK", "approval_mismatch");
  await page.getByRole("button", { name: /^A\./ }).click();
  await page.getByLabel("Action ID already executed (replay)", { exact: true }).check();
  await outcome("BLOCK", "action_replayed");
  await page.getByRole("button", { name: /^A\./ }).click();
  await page.getByLabel("Trusted state unavailable", { exact: true }).check();
  await outcome("BLOCK", "trusted_state_unavailable");
  await page.getByRole("button", { name: /^A\./ }).click();
  await page.getByLabel("Refund amount (USD)", { exact: true }).fill("0");
  await outcome("BLOCK", "invalid_input");
  await page.getByRole("button", { name: /^A\./ }).click();
  await outcome("ALLOW");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JSON", exact: true }).click();
  assert.equal((await downloadPromise).suggestedFilename(), "thv-guard-decision.json");
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("Denied in test")) }, configurable: true }));
  await page.reload();
  await outcome("ALLOW");
  await page.getByRole("button", { name: "Copy JSON", exact: true }).click();
  await page.getByRole("alert").getByText("Clipboard unavailable.", { exact: false }).waitFor();
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
  await page.screenshot({ path: "artifacts/screenshots/simulator-desktop.png", fullPage: true });
  console.log("PASS: simulator presets, exact approval, stale decisions, adversarial states, exports, and clipboard fallback");

  for (const [locale, evaluateName] of [["vi", "Đánh giá hành động"], ["zh", "评估操作"]]) {
    await page.goto(`${base}/${locale}/simulator`);
    await page.getByRole("button", { name: evaluateName, exact: true }).click();
    const json = await page.locator('.sim-output section:last-child pre').textContent();
    assert.equal(JSON.parse(json).result, "ALLOW");
  }
  await page.goto(`${base}/en/architecture`);
  const stage = page.locator(".architecture-stage").first();
  assert.equal(await stage.getAttribute("open"), null);
  await stage.locator("summary").click();
  assert.notEqual(await stage.getAttribute("open"), null);
  await stage.locator("dd").first().waitFor({ state: "visible" });
  await page.getByLabel("Language", { exact: true }).selectOption("vi");
  await page.waitForURL(`${base}/vi/architecture`);
  console.log("PASS: translated simulator, expandable architecture, route-preserving language switch");

  await page.goto(`${base}/en/contact`);
  const form = page.locator("form");
  await page.getByRole("button", { name: "Prepare email request", exact: true }).click();
  assert.equal(await form.evaluate((el) => el.checkValidity()), false);
  await page.getByLabel("Full name (Required)", { exact: true }).fill("Demo Tester");
  await page.getByLabel("Work email (Required)", { exact: true }).fill("demo@example.com");
  await page.getByLabel("Company (Required)", { exact: true }).fill("Example Test Company");
  await page.getByLabel("Role (Required)", { exact: true }).selectOption("engineering");
  await page.getByLabel("Agent maturity (Required)", { exact: true }).selectOption("staging");
  await page.getByRole("button", { name: "Prepare email request", exact: true }).click();
  assert.ok((await page.locator("#contact-errors").textContent()).includes("Select at least one"));
  await page.getByLabel("Issue refunds", { exact: true }).check();
  await page.getByLabel("Human approval", { exact: true }).check();
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Prepare email request", exact: true }).click();
  const draft = page.locator("#contact-request");
  await draft.waitFor();
  assert.ok((await draft.inputValue()).includes("To: contact@tuanhungvu.com"));
  assert.ok((await page.locator(".form-success").textContent()).includes("not sent or received"));
  await page.getByRole("button", { name: "Copy request", exact: true }).click();
  assert.ok((await page.locator("#contact-errors").textContent()).includes("Copy was unavailable"));
  await page.getByLabel("Company (Required)", { exact: true }).fill("Changed Example");
  assert.equal(await draft.count(), 0);
  await page.locator('#contact-role').evaluate((el) => { el.add(new Option('Tampered', 'not-allowed')); el.value = 'not-allowed'; });
  await page.getByRole("button", { name: "Prepare email request", exact: true }).click();
  assert.ok((await page.locator("#contact-errors").textContent()).includes("Role"));
  await page.locator('#contact-role').selectOption('engineering');
  await form.evaluate((el) => { const input = document.createElement('input'); input.type = 'hidden'; input.name = 'actions'; input.value = 'refund'; input.dataset.testTamper = 'true'; el.append(input); });
  await page.getByRole("button", { name: "Prepare email request", exact: true }).click();
  assert.ok((await page.locator("#contact-errors").textContent()).includes("Which actions"));
  await page.locator('[data-test-tamper]').evaluate((el) => el.remove());
  console.log("PASS: form validation and tampering rejection, exact recipient, honest draft state, copy fallback, and edit invalidation (no email sent)");

  await page.goto(`${base}/en`);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "artifacts/screenshots/home-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Pause animation", exact: true }).click();
  assert.equal(await page.locator(".guard-visual").getAttribute("class"), "guard-visual is-paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await page.locator(".packet-input").evaluate((el) => getComputedStyle(el).animationName), "none");
  await page.keyboard.press("Tab");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "artifacts/screenshots/home-mobile.png", fullPage: true });
  await page.locator(".mobile-menu summary").click();
  await page.locator(".mobile-menu nav").getByRole("link", { name: "Product", exact: true }).waitFor({ state: "visible" });
  assert.deepEqual(errors, [], `Browser exceptions: ${errors.join("; ")}`);
  console.log("PASS: animation pause/reduced motion, mobile navigation, and no browser exceptions");
  console.log("Screenshots saved in artifacts/screenshots/");
} finally {
  await browser.close();
}
