"use client";

import { Mountain, Send } from "lucide-react";
import { useCampaign } from "@/components/campaign-context";
import { uttarakhandCopy } from "@/lib/uttarakhand-copy";

export default function UttarakhandCultureSection() {
  const campaign = useCampaign();

  return (
    <section
      id="our-roots"
      aria-labelledby="our-roots-heading"
      data-no-split
      className="region-section overflow-hidden border-y border-[#dce1cf] bg-[#eceee1] py-[55px] text-[#173c34] max-[760px]:py-10.5"
    >
      <div className="relative mx-auto grid w-[calc(100%_-_128px)] max-w-[1280px] grid-cols-[.85fr_1.15fr] items-center gap-20 max-[1150px]:w-[calc(100%_-_80px)] max-[1150px]:gap-10 max-[900px]:w-[calc(100%_-_56px)] max-[900px]:gap-7 max-[760px]:w-[calc(100%_-_40px)] max-[760px]:grid-cols-1 max-[760px]:gap-9 max-[370px]:w-[calc(100%_-_32px)]">
        <div className="region-art relative h-[225px] w-full text-[#60744a] max-[760px]:mx-auto max-[760px]:h-[180px] max-[760px]:max-w-[350px]" aria-hidden="true">
          <Mountain className="mountain-art absolute left-[18%] top-1 opacity-25 max-[760px]:-top-3" size={120} strokeWidth={.6} />
          <svg viewBox="0 0 400 170" preserveAspectRatio="none" className="absolute left-0 top-2.5 h-[170px] w-[calc(100%_-_64px)] overflow-visible fill-none">
            <path d="M55 132C100 10 210 190 340 30" className="stroke-[#98a57b] stroke-[1.2] [stroke-dasharray:4_6]" />
            <path d="M55 132C100 10 210 190 340 30" className="route-shadow stroke-[#b7c39f] stroke-[22] opacity-15" />
          </svg>
          <div className="absolute top-[138px] left-[13.75%] z-1 flex -translate-x-1/2 flex-col items-center gap-3.5 text-[11px] font-semibold tracking-[1.3px] max-[900px]:text-[10px]">
            <span className="size-2 rounded-full bg-[#7c9366] shadow-[0_0_0_7px_#dae1ca,0_0_0_12px_#dfe5d3]" />
            GARHWAL
          </div>
          <Send className="route-plane absolute top-[95px] left-[47%] [transform:rotate(22deg)] fill-[#eceee1] stroke-[1.3]" size={28} />
          <div className="route-point point-doon absolute top-7.5 right-[4%] z-1 flex flex-col items-center gap-3.5 text-[11px] font-semibold tracking-[1.3px] max-[900px]:text-[10px] max-[760px]:right-0">
            <span className="size-2 rounded-full bg-[#7c9366] shadow-[0_0_0_7px_#dae1ca,0_0_0_12px_#dfe5d3]" />
            DEHRADUN
          </div>
        </div>
        <div className="max-w-[710px]">
          <p className="mb-5 flex items-center gap-3 text-[12px] font-semibold tracking-[1.8px] text-[#53665a] max-[760px]:text-[10px] max-[760px]:tracking-[1.3px]">
            <span aria-hidden="true" className="h-px w-7 shrink-0 bg-[#ad864b]" />
            DIFFERENT PLACES. ONE SHARED DREAM.
          </p>
          <h2 id="our-roots-heading" className="font-serif text-[38px] leading-[1.16] tracking-[-1.2px] max-[1150px]:text-[33px] max-[900px]:text-[31px] max-[760px]:text-[35px] max-[760px]:tracking-[-1px]">
            Your roots stay with you.<br />
            <em className="text-[#697550]">Your world gets bigger.</em>
          </h2>
          <p lang="gbm" className="mt-5 max-w-[590px] text-[16px] text-[#616b57]">
            {uttarakhandCopy.region}
          </p>
          <ul aria-label="Uttarakhand admission cities" className="mt-5 flex max-w-[590px] list-none flex-wrap gap-x-3 gap-y-1 border-t border-[#d0d8c3] pt-5 text-[12px] leading-[1.8] text-[#616c56] max-[760px]:gap-x-2.5 max-[760px]:text-[11px]">
            {campaign.driveStops.map((stop, index) => (
              <li key={stop.city} className="flex items-center gap-3 max-[760px]:gap-2.5">
                {index > 0 && <span aria-hidden="true" className="text-[#899574]">·</span>}
                {stop.city}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
