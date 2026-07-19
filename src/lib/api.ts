import type { Monster, MonsterManifest } from "./types";
import fs from "node:fs";
import path from "node:path";

const API_BASE = "https://dbruce32.github.io/msm-db/api";
const DATA_PATH = path.join(process.cwd(), "src", "data", "monsters.json");

/**
 * Fetch the monster manifest (list of all monsters with slugs).
 */
export async function fetchMonsterManifest(): Promise<MonsterManifest> {
  const res = await fetch(`${API_BASE}/monsters/index.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch monster manifest: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch a single monster's full data by slug.
 */
export async function fetchMonster(slug: string): Promise<Monster> {
  const res = await fetch(`${API_BASE}/monsters/${slug}.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch monster "${slug}": ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch all monsters from the API.
 * Fetches the manifest first, then all individual monster files in parallel.
 */
export async function fetchAllMonsters(): Promise<Monster[]> {
  const manifest = await fetchMonsterManifest();
  const monsters = await Promise.all(
    manifest.monsters.map((entry) => fetchMonster(entry.slug))
  );
  return monsters;
}

/**
 * Get all monsters from the pre-fetched local data file.
 * Used at build time by Next.js pages.
 */
export async function getAllMonsters(): Promise<Monster[]> {
  const data = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(data) as Monster[];
}
