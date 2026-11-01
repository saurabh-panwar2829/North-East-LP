import type { CampaignId } from "./campaigns";
import { uttarakhandCopy } from "./uttarakhand-copy";
import { uttarPradeshCopy } from "./uttar-pradesh-copy";

export type RegionalCopy = typeof uttarakhandCopy | typeof uttarPradeshCopy;

export function getRegionalCopy(id: CampaignId): RegionalCopy | undefined {
  if (id === "uttarakhand") return uttarakhandCopy;
  if (id === "uttar-pradesh") return uttarPradeshCopy;
  return undefined;
}
