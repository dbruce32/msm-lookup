import { fetchMonsterManifest, fetchMonster } from "../src/lib/api";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "src", "data");
const OUT_FILE = path.join(OUT_DIR, "monsters.json");
const BATCH_SIZE = 20;

const ASSET_MANIFESTS = [
  {
    name: "Elements",
    url: "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Elements/elements.json",
    countKey: "elements",
  },
  {
    name: "Islands",
    url: "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Islands/islands.json",
    countKey: "islands",
  },
  {
    name: "Currency",
    url: "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Currency/currency.json",
    countKey: "currencies",
  },
  {
    name: "General",
    url: "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/General/general.json",
    countKey: "assets",
  },
];

function elapsed(start: number): string {
  return ((Date.now() - start) / 1000).toFixed(2);
}

async function validateAssets() {
  console.log("\n📦 Validating asset manifests...");
  for (const manifest of ASSET_MANIFESTS) {
    try {
      const res = await fetch(manifest.url);
      if (!res.ok) {
        console.log(`  ⚠️  ${manifest.name}: HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      const count = data[manifest.countKey]?.length ?? 0;
      console.log(`  ✓ ${manifest.name}: ${count} assets available`);
    } catch (err) {
      console.log(`  ⚠️  ${manifest.name}: Failed to fetch (${(err as Error).message})`);
    }
  }
}

async function main() {
  const totalStart = Date.now();
  console.log("🚀 msm-lookup prebuild\n");

  // Step 1: Fetch monster manifest
  console.log("📋 Fetching monster manifest...");
  const manifestStart = Date.now();
  const manifest = await fetchMonsterManifest();
  console.log(`  ✓ Found ${manifest.monsters.length} monsters (${elapsed(manifestStart)}s)\n`);

  // Step 2: Fetch all monster data in batches
  console.log(`🐾 Fetching monster data (batch size: ${BATCH_SIZE})...`);
  const monsters = [];
  const totalBatches = Math.ceil(manifest.monsters.length / BATCH_SIZE);
  const fetchStart = Date.now();

  for (let i = 0; i < manifest.monsters.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batch = manifest.monsters.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((entry) => fetchMonster(entry.slug))
    );
    monsters.push(...results);
    const pct = Math.round((monsters.length / manifest.monsters.length) * 100);
    process.stdout.write(`\r  ⏳ Batch ${batchNum}/${totalBatches} — ${monsters.length}/${manifest.monsters.length} monsters (${pct}%)`);
  }
  console.log(`\n  ✓ Fetched all ${monsters.length} monsters (${elapsed(fetchStart)}s)\n`);

  // Step 3: Summarize data
  const classes = new Map<string, number>();
  let withBreeding = 0;
  let withEggs = 0;
  for (const m of monsters) {
    classes.set(m.class, (classes.get(m.class) ?? 0) + 1);
    if (Object.keys(m.breeding).length > 0) withBreeding++;
    if (m.eggs) withEggs++;
  }
  console.log("📊 Data summary:");
  console.log(`  • ${withBreeding} monsters with breeding data`);
  console.log(`  • ${withEggs} monsters with egg data`);
  console.log(`  • Classes: ${Array.from(classes.entries()).map(([k, v]) => `${k} (${v})`).join(", ")}`);

  // Step 4: Validate assets
  await validateAssets();

  // Step 5: Write output
  console.log("\n💾 Writing data...");
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(monsters, null, 2) + "\n");
  const fileSize = (Buffer.byteLength(JSON.stringify(monsters, null, 2)) / 1024).toFixed(0);
  console.log(`  ✓ Written to ${OUT_FILE} (${fileSize} KB)`);

  console.log(`\n✅ Done in ${elapsed(totalStart)}s`);
}

main().catch((err) => {
  console.error("\n❌ Failed to fetch data:", err);
  process.exit(1);
});
