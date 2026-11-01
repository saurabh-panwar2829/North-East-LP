import type { Metadata } from "next";
import { CAMPAIGNS, type CampaignId } from "@/lib/campaigns";

export function campaignMetadata(id: CampaignId): Metadata {
  const campaign = CAMPAIGNS[id];
  return {
    title: campaign.title,
    description: campaign.description,
    alternates: { canonical: `/${id}` },
    openGraph: {
      title: campaign.title,
      description: campaign.description,
      url: `/${id}`,
      type: "website",
      locale: "en_IN",
      images: [{ url: "/images/hero-campus-dgs.jpeg", alt: "Illustrative Doon Global School admissions campaign" }],
    },
  };
}
