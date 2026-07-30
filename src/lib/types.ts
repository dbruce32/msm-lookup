export interface BreedingEntry {
  pair: [string, string];
  time: string;
  enhanced_time: string;
}

export interface IslandBreeding {
  common?: BreedingEntry | null;
  rare?: BreedingEntry | null;
  epic?: BreedingEntry | null;
}

export interface EggRequirement {
  monster: string;
  quantity: number;
}

export interface EggData {
  // Common Wublin fields
  size?: string;
  cost?: string;
  time?: string;
  fill_price?: string;
  wildcards?: number;
  total?: number;
  requirements?: EggRequirement[];
  // Rare/Epic Wublin fields
  release_date?: string;
  // Celestial fields
  ascension_cost?: string;
  discounted_cost?: string;
  availability?: string;
  sells_for?: string;
  awakened_sells_for?: string;
}

export interface Monster {
  name: string;
  class: string;
  subclass?: string;
  elements: string[];
  associated_element?: string;
  variants: string[];
  breeding: Record<string, IslandBreeding>;
  eggs?: EggData;
}

export interface MonsterManifestEntry {
  name: string;
  slug: string;
  class: string;
  elements: string[];
}

export interface MonsterManifest {
  total: number;
  monsters: MonsterManifestEntry[];
}
