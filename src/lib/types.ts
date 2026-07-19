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

export interface Monster {
  name: string;
  class: string;
  elements: string[];
  variants: string[];
  breeding: Record<string, IslandBreeding>;
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
