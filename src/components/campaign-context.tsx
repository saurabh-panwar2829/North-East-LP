"use client";

import { createContext, useContext, type ReactNode } from "react";
import { CAMPAIGNS, type Campaign, type CampaignId } from "@/lib/campaigns";

const CampaignContext = createContext<Campaign | null>(null);

export function CampaignProvider({ id, children }: { id: CampaignId; children: ReactNode }) {
  return <CampaignContext.Provider value={CAMPAIGNS[id]}>{children}</CampaignContext.Provider>;
}

export function useCampaign() {
  const campaign = useContext(CampaignContext);
  if (!campaign) throw new Error("Campaign components require a CampaignProvider.");
  return campaign;
}
