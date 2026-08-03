import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plan = JSON.parse(await fs.readFile(path.join(root, "content-plan.json"), "utf8"));
const structureOnly = process.argv.includes("--structure-only");
if (plan.length !== 100) throw new Error(`Expected 100 posts, received ${plan.length}`);
if (new Set(plan.map((item) => item.id)).size !== 100) throw new Error("Duplicate post IDs");
for (const item of plan) {
  const assets = Array.isArray(item.assets) && item.assets.length ? item.assets : [item.asset];
  if (!structureOnly) {
    for (const asset of assets) await fs.access(path.join(root, asset));
  }
  if (!item.final_caption || !item.final_caption.trim()) throw new Error(`Blank caption ${item.id}`);
  const isLockedImageOnly =
    item.manual_asset_lock === true &&
    ["image_only_abstract", "image_text_abstract"].includes(item.format) &&
    ["cinematic-image-only-abstract-v3", "website-brand-image-text-v5"].includes(
      item.visual_revision,
    );
  if (item.status === "queued_auto" && item.format !== "mixed_abstract" && !isLockedImageOnly) {
    throw new Error(`Queued post ${item.id} is not using mixed-abstract format`);
  }
  if (
    item.status === "queued_auto" &&
    item.visual_revision !== "website-brand-mixed-abstract-v6" &&
    !isLockedImageOnly
  ) {
    throw new Error(`Queued post ${item.id} has the wrong visual revision`);
  }
  if (item.approval_required !== true) throw new Error(`Editorial approval must remain enabled for ${item.id}`);
  if (!["draft", "review", "queued_auto", "published"].includes(item.status)) {
    throw new Error(`Bad status ${item.id}`);
  }
  if (!["pending", "approved", "rejected"].includes(item.approval_status)) {
    throw new Error(`Bad approval status ${item.id}`);
  }
  if (item.status === "queued_auto" && item.approval_status !== "approved") {
    throw new Error(`Queued post ${item.id} must be editorially approved`);
  }
  if (!/^2026-\d{2}-\d{2}$/.test(item.date)) throw new Error(`Bad date ${item.id}`);
  if (item.time_wib !== "09:00") throw new Error(`Bad publish time ${item.id}`);
  if (!["carousel", "single"].includes(item.post_type)) {
    throw new Error(`Bad post type ${item.id}: ${item.post_type}`);
  }
  const expectedSlides = item.post_type === "carousel" ? 5 : 1;
  if (assets.length !== expectedSlides || item.slide_count !== expectedSlides) {
    throw new Error(`Bad slide count ${item.id}: expected ${expectedSlides}, received ${assets.length}`);
  }
  if (!Array.isArray(item.slides) || item.slides.length !== expectedSlides) {
    throw new Error(`Bad slide plan ${item.id}`);
  }
  if (item.audio?.selection !== "trending") throw new Error(`Bad audio policy ${item.id}`);
  if (!item.audio?.original_preview_asset || !item.audio?.native_search || !item.audio?.bpm) {
    throw new Error(`Incomplete audio direction ${item.id}`);
  }
  if (!structureOnly) await fs.access(path.join(root, item.audio.original_preview_asset));
  if (item.audio?.graph_api_attachment !== false) {
    throw new Error(`Image/carousel audio must not be marked as Graph API attached ${item.id}`);
  }
}

const fullWeeks = Array.from({ length: 14 }, (_, index) => plan.slice(index * 7, index * 7 + 7));
for (const [index, week] of fullWeeks.entries()) {
  const carousel = week.filter((item) => item.post_type === "carousel").length;
  const single = week.filter((item) => item.post_type === "single").length;
  if (carousel !== 3 || single !== 4) {
    throw new Error(`Week ${index + 1} must contain 3 carousel and 4 single posts`);
  }
}
const patterns = new Set(fullWeeks.map((week) => week.map((item) => item.post_type[0]).join("")));
if (patterns.size < 4) throw new Error("Weekly post order is not varied enough");

const finalPartialWeek = plan.slice(98);
if (
  finalPartialWeek.filter((item) => item.post_type === "carousel").length !== 1 ||
  finalPartialWeek.filter((item) => item.post_type === "single").length !== 1
) {
  throw new Error("Final two-day partial week must contain one carousel and one single post");
}

const carouselCount = plan.filter((item) => item.post_type === "carousel").length;
const singleCount = plan.filter((item) => item.post_type === "single").length;
const queued = plan.filter((item) => item.status === "queued_auto");
const themes = new Set(queued.map((item) => item.content_theme));
const families = new Set(queued.map((item) => item.subject_family));
const educationCount = queued.filter((item) => item.content_theme === "education").length;
if (themes.size < 9 || educationCount > 20) {
  throw new Error(`Content mix is too narrow: ${themes.size} themes, ${educationCount} educational queued posts`);
}
if (!["human", "object", "scene"].every((family) => families.has(family))) {
  throw new Error(`Subject mix is incomplete: ${[...families].join(", ")}`);
}
console.log(
  `Validated 100 posts: ${carouselCount} carousel, ${singleCount} single, ${themes.size} content themes, ${families.size} subject families${structureOnly ? " (structure only)" : " (all assets present)"}.`,
);
