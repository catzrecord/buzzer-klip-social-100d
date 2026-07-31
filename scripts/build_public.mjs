import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plan = JSON.parse(await fs.readFile(path.join(root, "content-plan.json"), "utf8"));
const publicDir = path.join(root, "public");
await fs.mkdir(publicDir, { recursive: true });
await fs.copyFile(path.join(root, "content-plan.json"), path.join(publicDir, "content-plan.json"));
for (const item of plan) {
  const assets = Array.isArray(item.assets) && item.assets.length ? item.assets : [item.asset];
  for (const asset of assets) {
    const source = path.join(root, asset);
    const target = path.join(publicDir, asset);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(source, target);
  }
}
const rows = plan.map((item) => {
  const caption = String(item.final_caption || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const title = String(item.title || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return `<article class="${item.status}"><div class="cover"><img src="${item.asset}" alt="${title}"><span>${item.post_type === "carousel" ? `${item.slide_count} SLIDE` : "SINGLE"}</span></div><div><small>#${String(item.id).padStart(3,"0")} · ${item.date} · ${item.post_type} · ${item.format}</small><strong>${title}</strong><p>${caption.replaceAll("\n", "<br>")}</p><em>${item.status === "published" ? "LIVE" : "QUEUED"}</em></div></article>`;
}).join("\n");
const publishedCount = plan.filter((item) => item.status === "published").length;
const queuedCount = plan.filter((item) => item.status === "queued_auto").length;
const blankCount = plan.filter((item) => !String(item.final_caption || "").trim()).length;
const html = `<!doctype html>
<html lang="id">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Buzzer Klip · Potong. Posting. Cuan.</title>
<style>
:root{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;color:#0a0a0a;background:#fdfbf7}*{box-sizing:border-box}body{margin:0;padding:32px}header{max-width:1240px;margin:0 auto 34px;background:#d4ff00;border:3px solid #0a0a0a;box-shadow:8px 8px 0 #0a0a0a;padding:28px;border-radius:20px}h1{margin:8px 0;font-size:clamp(36px,7vw,86px);letter-spacing:-.08em;line-height:.9;text-transform:uppercase}p{color:#4a4a4a;line-height:1.45}header p{max-width:760px}b{color:#ff2a7a}.grid{display:grid;max-width:1240px;margin:auto;grid-template-columns:repeat(4,1fr);gap:18px}article{overflow:hidden;border:3px solid #0a0a0a;border-radius:18px;background:#fff;box-shadow:5px 5px 0 #0a0a0a}.cover{position:relative;padding:0}.cover img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover}.cover span{position:absolute;right:10px;top:10px;background:#d4ff00;border:2px solid #0a0a0a;padding:6px 8px;font-size:10px;font-weight:900;box-shadow:3px 3px 0 #0a0a0a}article>div:not(.cover){display:grid;gap:8px;padding:14px}small,em{font-size:10px;text-transform:uppercase;letter-spacing:.09em;font-weight:800}strong{font-size:16px;line-height:1.05;text-transform:uppercase}article p{font-size:12px;margin:0}em{color:#ff2a7a}.published{background:#b9a2ff}.published em{color:#00a87a}.queued_auto{background:#fff}@media(max-width:950px){.grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:680px){body{padding:16px}.grid{grid-template-columns:repeat(2,1fr);gap:12px}header{padding:20px}}
</style>
<header><small>BUZZER KLIP · CREATOR ECONOMY QUEUE</small><h1>Potong.<br><b>Posting. Cuan.</b></h1><p>${publishedCount} live sekarang · ${queuedCount} berikutnya · ${plan.length} visual original · ${blankCount} caption kosong · gaya neo-brutalist creator Indonesia</p></header>
<main class="grid">${rows}</main>
</html>`;
await fs.writeFile(path.join(publicDir, "index.html"), html);
console.log(`Prepared ${plan.length} Buzzer Klip campaign assets in public/`);
