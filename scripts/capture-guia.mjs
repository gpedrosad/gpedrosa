import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = path.join(root, "output/guia/guia.html");
const outDir = path.join(root, "public/captacion");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1400, height: 1800 },
  deviceScaleFactor: 2,
});

await page.goto(`file://${html}`, { waitUntil: "networkidle" });
await page.addStyleTag({
  content: `
    .reader-tools, .mobile-bar, .toc-dialog { display: none !important; }
    body { margin: 0 !important; padding: 0 !important; background: #ffffff; }
    .document { transform: none !important; margin: 0 !important; width: 794px !important; }
    .page {
      box-shadow: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
      width: 210mm !important;
      min-height: 297mm !important;
      height: 297mm !important;
    }
  `,
});

await page.locator("#portada").screenshot({
  path: path.join(outDir, "guia-portada.png"),
  type: "png",
});
await page.locator("#decision-1").screenshot({
  path: path.join(outDir, "guia-interior.png"),
  type: "png",
});

await browser.close();
console.log("ok");
