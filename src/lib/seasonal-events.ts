export interface SeasonalEvent {
  name: string;
  island: string;
  holiday: string;
  /** Approximate start (month 1-12, day 1-31) */
  start: { month: number; day: number };
  /** Approximate end (month 1-12, day 1-31) */
  end: { month: number; day: number };
}

/**
 * Seasonal events with conservative approximate date ranges.
 * These shift each year — displayed as "typically active" rather than exact.
 * Ordered chronologically by start date within a calendar year.
 */
export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    name: "Crescendo Moon",
    island: "Magical Sanctum",
    holiday: "Lunar New Year",
    start: { month: 1, day: 15 },
    end: { month: 2, day: 15 },
  },
  {
    name: "Season of Love",
    island: "Air Island",
    holiday: "Valentine's Day",
    start: { month: 1, day: 28 },
    end: { month: 2, day: 25 },
  },
  {
    name: "Cloverspell",
    island: "Faerie Island",
    holiday: "St. Patrick's Day",
    start: { month: 3, day: 3 },
    end: { month: 3, day: 18 },
  },
  {
    name: "Eggs-Travaganza",
    island: "Water Island",
    holiday: "Easter",
    start: { month: 3, day: 25 },
    end: { month: 4, day: 15 },
  },
  {
    name: "Echoes of Eco",
    island: "Amber Island",
    holiday: "Earth Day",
    start: { month: 4, day: 15 },
    end: { month: 5, day: 5 },
  },
  {
    name: "Perplexplore",
    island: "Fire Oasis",
    holiday: "International Museum Day",
    start: { month: 5, day: 12 },
    end: { month: 5, day: 30 },
  },
  {
    name: "Life-Formula",
    island: "Ethereal Island",
    holiday: "Ethereal Anniversary",
    start: { month: 6, day: 3 },
    end: { month: 6, day: 25 },
  },
  {
    name: "SkyPainting",
    island: "Light Island",
    holiday: "Pride Month",
    start: { month: 6, day: 25 },
    end: { month: 7, day: 7 },
  },
  {
    name: "SummerSong",
    island: "Earth Island",
    holiday: "Summer",
    start: { month: 7, day: 5 },
    end: { month: 8, day: 5 },
  },
  {
    name: "MindBoggle",
    island: "Psychic Island",
    holiday: "Back to School",
    start: { month: 8, day: 5 },
    end: { month: 8, day: 28 },
  },
  {
    name: "Anniversary Month",
    island: "Gold Island",
    holiday: "MSM Anniversary",
    start: { month: 8, day: 28 },
    end: { month: 10, day: 5 },
  },
  {
    name: "Spooktacle",
    island: "Plant Island",
    holiday: "Halloween",
    start: { month: 10, day: 8 },
    end: { month: 11, day: 3 },
  },
  {
    name: "Beat Hereafter",
    island: "Bone Island",
    holiday: "Day of the Dead",
    start: { month: 10, day: 25 },
    end: { month: 11, day: 7 },
  },
  {
    name: "Feast-Ember",
    island: "Fire Haven",
    holiday: "Thanksgiving",
    start: { month: 11, day: 13 },
    end: { month: 11, day: 30 },
  },
  {
    name: "Festival of Yay",
    island: "Cold Island",
    holiday: "Christmas",
    start: { month: 12, day: 5 },
    end: { month: 1, day: 5 },
  },
];
