export type CampaignId = "north-east" | "uttarakhand";
export const NORTH_EAST_CITIES = ["Guwahati", "Aizawl", "Itanagar", "Jorhat", "Dimapur", "Siliguri", "Kolkata"] as const;
export const GARHWAL_CITIES = ["Srinagar", "Pauri", "Kotdwar", "New Tehri"] as const;
export const KUMAUN_CITIES = ["Haldwani", "Almora", "Rudrapur", "Pithoragarh"] as const;
export type DriveCity = (typeof NORTH_EAST_CITIES)[number] | (typeof GARHWAL_CITIES)[number] | (typeof KUMAUN_CITIES)[number];
export const OTHER_TOWN = "Other town in Uttarakhand";

export type DriveStop = { city: DriveCity; area: string; date: string; venue: string };
export type Campaign = {
  id: CampaignId;
  name: string;
  eyebrow: string;
  audience: string;
  heroLines: [string, string];
  title: string;
  description: string;
  source: string;
  defaultTown: string;
  homeGroups: { label: string; towns: readonly string[] }[];
  driveStops: DriveStop[];
};

// Edit a stop's date and venue only when the admissions team confirms them.
export const CAMPAIGNS: Record<CampaignId, Campaign> = {
  "north-east": {
    id: "north-east",
    name: "North East",
    eyebrow: "NORTH EAST INDIA",
    audience: "Siliguri & North East India",
    heroLines: ["Excellence. Growth.", "A brighter future."],
    title: "North East Admissions 2027–28 | Doon Global School",
    description: "Explore CBSE boys’ boarding for Classes 3–12 at Doon Global School, Dehradun. Admissions for families from North East India, Siliguri and Kolkata, session 2027–28.",
    source: "north-east-landing-page",
    defaultTown: "Siliguri",
    homeGroups: [{ label: "Admission cities", towns: NORTH_EAST_CITIES }],
    driveStops: NORTH_EAST_CITIES.map(city => ({ city, area: "", date: "", venue: "" })),
  },
  uttarakhand: {
    id: "uttarakhand",
    name: "Uttarakhand",
    eyebrow: "GARHWAL & KUMAUN",
    audience: "Garhwal & Kumaun",
    heroLines: ["नौन्याळौं कु भलु भोल।", "Ready for the world."],
    title: "Garhwal & Kumaun Admissions 2027–28 | Doon Global School",
    description: "A new chapter in Dehradun for families across Garhwal and Kumaun. Explore Doon Global School’s CBSE boys’ boarding, Classes 3–12, and enquire for 2027–28.",
    source: "uttarakhand-garhwal-kumaun-landing-page",
    defaultTown: "",
    homeGroups: [
      { label: "Garhwal", towns: [...GARHWAL_CITIES, "Dehradun", "Haridwar", "Rishikesh", "Chamoli", "Rudraprayag", "Uttarkashi"] },
      { label: "Kumaun", towns: [...KUMAUN_CITIES, "Nainital", "Bageshwar", "Champawat", "Kashipur", "Ranikhet"] },
    ],
    driveStops: [
      ...GARHWAL_CITIES.map(city => ({ city, area: "Garhwal", date: "", venue: "" })),
      ...KUMAUN_CITIES.map(city => ({ city, area: "Kumaun", date: "", venue: "" })),
    ],
  },
};

export function getCampaign(id: unknown): Campaign | undefined {
  return id === "north-east" || id === "uttarakhand" ? CAMPAIGNS[id] : undefined;
}

export function campaignCityLabel(campaign: Campaign) {
  const cities = campaign.driveStops.map(stop => stop.city);
  return `${cities.slice(0, -1).join(", ")} and ${cities.at(-1)}`;
}
