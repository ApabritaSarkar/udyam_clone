const fs = require("fs");
const puppeteer = require("puppeteer");

const URL = "https://udyamregistration.gov.in/UdyamRegistration.aspx";

function collectFields() {
  // Runs in browser context
  const grab = (root) => {
    const inputs = [...root.querySelectorAll("input, select, textarea")];
    return inputs.map(el => {
      const id = el.id || "";
      const name = el.name || "";
      const type = (el.tagName.toLowerCase() === "select") ? "select" : (el.type || el.tagName.toLowerCase());
      const label = id ? (root.querySelector(`label[for='${id}']`)?.innerText?.trim() || "") : "";
      const placeholder = el.getAttribute("placeholder") || "";
      const required = el.hasAttribute("required");
      const pattern = el.getAttribute("pattern") || "";
      const options = type === "select" ? [...el.querySelectorAll("option")].map(o => ({value:o.value, label:o.textContent.trim()})) : [];
      return { id, name, type, label, placeholder, required, pattern, options };
    });
  };
  // Heuristic: find visible step containers (you can adjust selectors after one dry run)
  const stepContainers = [...document.querySelectorAll("form, .container, .panel, .card")];
  // Fallback to whole document if needed:
  const root = stepContainers[0] || document.body;
  return grab(root);
}

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 0 });

  // STEP 1 (Aadhaar + OTP UI area) — capture form fields on initial view
  const step1Fields = await page.evaluate(collectFields);

  // STEP 2 (PAN UI) — if there’s a button/tab, try to navigate/click to step 2 view.
  // Adjust selectors based on what you see in DevTools:
  // Example (replace '#toPanStep' with the real selector you find):
  // await page.click("#toPanStep");
  // await page.waitForNetworkIdle({ idleTime: 800 });

  // For first run, we’ll just re-collect (you will refine after inspecting the live page):
  const step2Fields = []; // fill after you identify how to open Step 2 view

  const schema = {
    source: URL,
    scrapedAt: new Date().toISOString(),
    steps: [
      { step: 1, name: "Aadhaar & OTP", fields: step1Fields },
      { step: 2, name: "PAN Validation", fields: step2Fields }
    ]
  };

  fs.mkdirSync("../schema", { recursive: true });
  fs.writeFileSync("../schema/udyam_steps_1_2.json", JSON.stringify(schema, null, 2));
  await browser.close();
})();
