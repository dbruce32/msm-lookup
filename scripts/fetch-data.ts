import { fetchAllMonsters } from "../src/lib/api";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "src", "data");
const OUT_FILE = path.join(OUT_DIR, "monsters.json");

async function main() {
  console.log("Fetching monster data from msm-db API...");
  const startTime = Date.now();

  const monsters = await fetchAllMonsters();

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(monsters, null, 2) + "\n");

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Fetched ${monsters.length} monsters in ${elapsed}s`);
  console.log(`Written to ${OUT_FILE}`);
}

main().catch((err) => {
  console.error("Failed to fetch data:", err);
  process.exit(1);
});
