export type CampaignId = "north-east" | "uttarakhand" | "uttar-pradesh";
export const NORTH_EAST_CITIES = ["Guwahati", "Aizawl", "Itanagar", "Jorhat", "Dimapur", "Siliguri", "Kolkata"] as const;
export const GARHWAL_CITIES = ["Srinagar", "Pauri", "Kotdwar", "New Tehri", "Karnaprayag", "Gopeshwar", "Lansdowne", "Uttarkashi", "Rudraprayag"] as const;
export const EAST_UP_CITIES = ["Varanasi", "Gorakhpur", "Prayagraj", "Azamgarh", "Mau", "Jaunpur", "Ghazipur", "Ballia", "Deoria", "Mirzapur", "Bhadohi"] as const;
export const WEST_UP_CITIES = ["Moradabad", "Bareilly", "Budaun", "Hapur", "Shahjahanpur", "Chandausi", "Sambhal", "Meerut", "Muzaffarnagar", "Saharanpur", "Baghpat"] as const;
export type DriveCity = (typeof NORTH_EAST_CITIES)[number] | (typeof GARHWAL_CITIES)[number] | (typeof EAST_UP_CITIES)[number] | (typeof WEST_UP_CITIES)[number];
export const OTHER_TOWN = "Other town in Uttarakhand";
export const OTHER_UP_TOWN = "Other town in Uttar Pradesh";

export type DriveStop = { city: DriveCity; area: string; date: string; venue: string };
export type Campaign = {
  id: CampaignId;
  admissionsPhone: string;
  admissionsPhoneLabel: string;
  name: string;
  eyebrow: string;
  audience: string;
  heroLines: [string, string];
  title: string;
  description: string;
  source: string;
  defaultTown: string;
  otherTown?: string;
  driveRegions?: readonly string[];
  homeGroups: { label: string; towns: readonly string[] }[];
  driveStops: DriveStop[];
};

// Edit a stop's date and venue only when the admissions team confirms them.
export const CAMPAIGNS: Record<CampaignId, Campaign> = {
  "north-east": {
    id: "north-east",
    admissionsPhone: "+917455997333",
    admissionsPhoneLabel: "+91 74559 97333",
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
    admissionsPhone: "+919528687660",
    admissionsPhoneLabel: "+919528687660",
    name: "Uttarakhand",
    eyebrow: "GARHWAL",
    audience: "Garhwal",
    heroLines: ["नौन्याळौं कु भलु भोल।", "Ready for the world."],
    title: "Garhwal Admissions 2027–28 | Doon Global School",
    description: "A new chapter in Dehradun for families across Garhwal. Explore Doon Global School’s CBSE boys’ boarding, Classes 3–12, and enquire for 2027–28.",
    source: "uttarakhand-garhwal-landing-page",
    defaultTown: "",
    otherTown: OTHER_TOWN,
    homeGroups: [
      { label: "Garhwal", towns: [...GARHWAL_CITIES, "Dehradun", "Haridwar", "Rishikesh", "Chamoli"] },
    ],
    driveStops: GARHWAL_CITIES.map(city => ({ city, area: "Garhwal", date: "", venue: "" })),
  },
  "uttar-pradesh": {
    id: "uttar-pradesh",
    admissionsPhone: "+917455997333",
    admissionsPhoneLabel: "+91 74559 97333",
    name: "Uttar Pradesh",
    eyebrow: "UTTAR PRADESH",
    audience: "Uttar Pradesh",
    heroLines: ["बड़े सपनों की नई शुरुआत।", "Ready for the world."],
    title: "Uttar Pradesh Admissions 2027–28 | Doon Global School",
    description: "For families across Uttar Pradesh: discover CBSE boys’ boarding for Classes 3–12 at Doon Global School, Dehradun. Register interest in the 2027–28 admission drive.",
    source: "uttar-pradesh-landing-page",
    defaultTown: "",
    otherTown: OTHER_UP_TOWN,
    driveRegions: ["East UP", "West UP"],
    homeGroups: [
      { label: "East UP", towns: EAST_UP_CITIES },
      { label: "West UP", towns: WEST_UP_CITIES },
    ],
    driveStops: [
      ...EAST_UP_CITIES.map(city => ({ city, area: "East UP", date: "", venue: "" })),
      ...WEST_UP_CITIES.map(city => ({ city, area: "West UP", date: "", venue: "" })),
    ],
  },
};

export function getCampaign(id: unknown): Campaign | undefined {
  return id === "north-east" || id === "uttarakhand" || id === "uttar-pradesh" ? CAMPAIGNS[id] : undefined;
}

export function campaignCityLabel(campaign: Campaign) {
  const cities = campaign.driveStops.map(stop => stop.city);
  return `${cities.slice(0, -1).join(", ")} and ${cities.at(-1)}`;
}
