const ELEMENTS_BASE_URL =
  "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Elements";

/**
 * Maps element names from monster data to their image filenames.
 * Handles naming differences between the data and the asset manifest.
 */
const ELEMENT_FILE_MAP: Record<string, string> = {
  Air: "air.png",
  "Anniversary Month": "anniversary_month.png",
  "Beat Hereafter": "beat_hereafter.png",
  Bone: "bone.png",
  Celestial: "celestial.png",
  Cloverspell: "cloverspell.png",
  Cold: "cold.png",
  Control: "control.png",
  "Crescendo Moon": "crescendo_moon.png",
  Crystal: "crystal.png",
  Dream: "dream.png",
  Depths: "depths.png",
  Earth: "earth.png",
  "Echoes of Eco": "echoes_of_eco.png",
  "Eggs-Travaganza": "eggs-travaganza.png",
  Electricity: "electricity.png",
  Faerie: "faerie.png",
  "Feast-Ember": "feast_ember.png",
  "Festival of Yay": "festival_of_yay.png",
  Fire: "fire.png",
  Hoax: "hoax.png",
  Legendary: "legendary.png",
  "Life-Formula": "life-formula.png",
  Light: "light.png",
  Mech: "mech.png",
  MindBoggle: "mindboggle.png",
  Mythical: "mythical.png",
  Perplexplore: "perplexplore.png",
  Plant: "plant.png",
  Plasma: "plasma.png",
  Poison: "poison.png",
  Psychic: "psychic.png",
  Ruin: "ruin.png",
  "Season of Love": "season_of_love.png",
  Shadow: "shadow.png",
  SkyPainting: "skypainting.png",
  Spooktacle: "spooktacle.png",
  SummerSong: "SummerSong.png",
  Water: "water.png",
  Wublin: "wublin.png",
};

function getElementImageUrl(element: string): string | null {
  const file = ELEMENT_FILE_MAP[element];
  if (!file) return null;
  return `${ELEMENTS_BASE_URL}/${file}`;
}

interface ElementIconProps {
  element: string;
  size?: number;
}

export function ElementIcon({ element, size = 20 }: ElementIconProps) {
  const url = getElementImageUrl(element);

  if (!url) {
    // Fallback to text badge for unknown elements
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-gray-100 text-gray-700 border-gray-200">
        {element}
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={element}
      title={element}
      width={size}
      height={size}
      className="inline-block"
      loading="lazy"
    />
  );
}
