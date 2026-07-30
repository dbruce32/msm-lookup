const ISLANDS_BASE_URL =
  "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Islands";

const ISLAND_FILE_MAP: Record<string, string> = {
  "Air Island": "air.png",
  "Amber Island": "amber_island.png",
  "Bone Island": "bone.png",
  "Celestial Island": "celestial.png",
  "Cold Island": "cold.png",
  "The Colossingum": "colossingum.png",
  "Composer Island": "composer.png",
  "Crystal Islet": "crystal_islet.png",
  "Earth Island": "earth.png",
  "Ethereal Island": "ethereal.png",
  "Ethereal Workshop": "ethereal_workshop.png",
  "Faerie Island": "faerie.png",
  "Fire Haven": "fire_haven.png",
  "Fire Oasis": "fire_oasis.png",
  "Gold Island": "gold.png",
  "Light Island": "light.png",
  "Magical Nexus": "magical_nexus.png",
  "Magical Sanctum": "magical_sanctum.png",
  "Major Paironormal Carnival": "major_paironormal_carnival.png",
  "Mech Islet": "mech_islet.png",
  "Minor Paironormal Carnival": "minor_paironormal_carnival.png",
  "Mirror Air Island": "mirror_air.png",
  "Mirror Bone Island": "mirror_bone.png",
  "Mirror Cold Island": "mirror_cold.png",
  "Mirror Earth Island": "mirror_earth.png",
  "Mirror Faerie Island": "mirror_faerie.png",
  "Mirror Light Island": "mirror_light.png",
  "Mirror Plant Island": "mirror_plant.png",
  "Mirror Psychic Island": "mirror_psychic.png",
  "Mirror Water Island": "mirror_water.png",
  "Mythical Island": "mythical.png",
  "Plant Island": "plant.png",
  "Plasma Islet": "plasma_islet.png",
  "Psychic Island": "psychic.png",
  "Seasonal Shanty": "seasonal_shanty.png",
  "Shadow Islet": "shadow_islet.png",
  "Shugabush Island": "shugabush.png",
  "Tribal Island": "tribal.png",
  "Water Island": "water.png",
  "Wublin Island": "wublin.png",
};

function getIslandImageUrl(island: string): string | null {
  const file = ISLAND_FILE_MAP[island];
  if (!file) return null;
  return `${ISLANDS_BASE_URL}/${file}`;
}

interface IslandIconProps {
  island: string;
  size?: number;
}

export function IslandIcon({ island, size = 24 }: IslandIconProps) {
  const url = getIslandImageUrl(island);

  if (!url) {
    return <span>🏝️</span>;
  }

  return (
    <img
      src={url}
      alt={island}
      title={island}
      width={size}
      height={size}
      className="inline-block"
      loading="lazy"
    />
  );
}
