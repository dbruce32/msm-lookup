import type { Monster, MonsterManifest } from "./types";
import fs from "node:fs";
import path from "node:path";

const API_BASE = "https://dbruce32.github.io/msm-db/api";
const DATA_PATH = path.join(process.cwd(), "src", "data", "monsters.json");

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const BATCH_SIZE = 20;

/**
 * Fetch with retry logic for transient failures (503, 429, network errors).
 */
async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      if (res.status >= 500 || res.status === 429) {
        if (attempt < retries) {
          await sleep(RETRY_DELAY_MS * attempt);
          continue;
        }
      }
      throw new Error(`HTTP ${res.status} for ${url}`);
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  throw new Error(`Failed after ${retries} retries: ${url}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch the monster manifest (list of all monsters with slugs).
 */
export async function fetchMonsterManifest(): Promise<MonsterManifest> {
  const res = await fetchWithRetry(`${API_BASE}/monsters/index.json`);
  return res.json();
}

/**
 * Fetch a single monster's full data by slug.
 */
export async function fetchMonster(slug: string): Promise<Monster> {
  const res = await fetchWithRetry(`${API_BASE}/monsters/${slug}.json`);
  return res.json();
}

/**
 * Fetch all monsters from the API.
 * Fetches in batches to avoid overwhelming GitHub Pages CDN.
 */
export async function fetchAllMonsters(): Promise<Monster[]> {
  const manifest = await fetchMonsterManifest();
  const monsters: Monster[] = [];

  for (let i = 0; i < manifest.monsters.length; i += BATCH_SIZE) {
    const batch = manifest.monsters.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((entry) => fetchMonster(entry.slug))
    );
    monsters.push(...results);
  }

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
