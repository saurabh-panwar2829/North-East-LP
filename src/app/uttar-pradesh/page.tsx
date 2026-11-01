import CampaignPage from "@/components/campaign-page";
import { campaignMetadata } from "@/lib/campaign-metadata";

export const metadata = campaignMetadata("uttar-pradesh");

export default function UttarPradeshPage() {
  return <CampaignPage campaignId="uttar-pradesh" />;
}
