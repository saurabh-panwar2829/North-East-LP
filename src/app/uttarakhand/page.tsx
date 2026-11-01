import CampaignPage from "@/components/campaign-page";
import { campaignMetadata } from "@/lib/campaign-metadata";

export const metadata = campaignMetadata("uttarakhand");

export default function UttarakhandPage() {
  return <CampaignPage campaignId="uttarakhand" />;
}
