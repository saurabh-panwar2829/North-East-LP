import CampaignPage from "@/components/campaign-page";
import { campaignMetadata } from "@/lib/campaign-metadata";

export const metadata = campaignMetadata("north-east");

export default function NorthEastPage() {
  return <CampaignPage campaignId="north-east" />;
}
