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
for (const audioAsset of new Set(plan.map((item) => item.audio?.original_preview_asset).filter(Boolean))) {
  const source = path.join(root, audioAsset);
  const target = path.join(publicDir, audioAsset);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
}
const rows = plan.map((item) => {
  const caption = String(item.final_caption || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const title = String(item.title || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const audioTitle = String(item.audio?.original_preview_title || "Audio preview").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const audioAsset = String(item.audio?.original_preview_asset || "");
  const audio = audioAsset ? `<label>♪ ${audioTitle} · ${item.audio.bpm} BPM</label><audio controls preload="none" src="${audioAsset}"></audio>` : "";
  return `<article class="${item.status}"><div class="cover"><img src="${item.asset}" alt="${title}"><span>${item.post_type === "carousel" ? `${item.slide_count} SLIDE` : "SINGLE"}</span></div><div><small>#${String(item.id).padStart(3,"0")} · ${item.date} · ${item.post_type} · ${item.format}</small><strong>${title}</strong>${audio}<p>${caption.replaceAll("\n", "<br>")}</p><em>${item.status === "published" ? "LIVE" : "QUEUED"}</em></div></article>`;
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
:root{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;color:#f7f6f2;background:#050607}*{box-sizing:border-box}body{margin:0;padding:32px;background:radial-gradient(circle at top,#14201d,#050607 42%)}header{max-width:1240px;margin:0 auto 34px;background:#c8ff00;color:#070807;border:3px solid #070807;box-shadow:8px 8px 0 #ff2783;padding:28px;border-radius:20px}h1{margin:8px 0;font-size:clamp(36px,7vw,86px);letter-spacing:-.08em;line-height:.9;text-transform:uppercase}p{color:#b9bfbd;line-height:1.45}header p{max-width:820px;color:#1c241a}b{color:#ff2783}.grid{display:grid;max-width:1240px;margin:auto;grid-template-columns:repeat(4,1fr);gap:18px}article{overflow:hidden;border:2px solid #29302f;border-radius:18px;background:#0e1112;box-shadow:0 0 24px #00d8ef18}.cover{position:relative;padding:0}.cover img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover}.cover span{position:absolute;right:10px;top:10px;background:#c8ff00;color:#050607;border:2px solid #050607;padding:6px 8px;font-size:10px;font-weight:900;box-shadow:3px 3px 0 #ff2783}article>div:not(.cover){display:grid;gap:8px;padding:14px}small,em,label{font-size:10px;text-transform:uppercase;letter-spacing:.09em;font-weight:800}strong{font-size:16px;line-height:1.05;text-transform:uppercase}article p{font-size:12px;margin:0}audio{width:100%;height:30px}label{color:#00d8ef}em{color:#ff2783}.published{background:#241a39}.published em{color:#c8ff00}.queued_auto{background:#0e1112}@media(max-width:950px){.grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:680px){body{padding:16px}.grid{grid-template-columns:repeat(2,1fr);gap:12px}header{padding:20px}}
</style>
<header><small>BUZZER KLIP · 100-DAY ABSTRACT HUMAN QUEUE</small><h1>Orang Abstrak.<br><b>Energi Nyata.</b></h1><p>${publishedCount} live sekarang · ${queuedCount} berikutnya · ${plan.length} hari · ${blankCount} caption kosong · cinematic neon abstract-human · original audio direction tersedia di setiap post</p></header>
<main class="grid">${rows}</main>
</html>`;
await fs.writeFile(path.join(publicDir, "index.html"), html);
console.log(`Prepared ${plan.length} Buzzer Klip campaign assets in public/`);
