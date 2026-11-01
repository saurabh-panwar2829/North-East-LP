"use client";

import { useEffect, useRef, useState } from "react";
import { Mountain, Send } from "lucide-react";
import { useCampaign } from "@/components/campaign-context";
import { uttarakhandCopy } from "@/lib/uttarakhand-copy";

export default function UttarakhandCultureSection() {
  const campaign = useCampaign();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;

    const syncPlayback = () => {
      if (disposed || !visible || document.hidden || motion.matches) {
        video.pause();
        return;
      }
      // Attach the source only when this below-the-fold section is visible.
      if (!video.getAttribute("src")) video.src = "/videos/garhwali-dance-background.mp4";
      video.play().then(() => {
        if (disposed || !visible || document.hidden || motion.matches) video.pause();
      }).catch(() => { /* Keep the poster if autoplay is blocked. */ });
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    observer.observe(section);
    motion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      disposed = true;
      observer.disconnect();
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <section
      id="our-roots"
      ref={sectionRef}
      aria-labelledby="our-roots-heading"
      data-no-split
      className="region-section relative isolate flex min-h-[660px] items-end overflow-hidden bg-[#052c25] text-[#fffdf5] max-[760px]:min-h-[680px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center max-[760px]:bg-[position:68%_center]"
        style={{ backgroundImage: "url('/videos/garhwali-dance-poster.webp')" }}
      >
        <video
          ref={videoRef}
          id="garhwali-culture-video"
          poster="/videos/garhwali-dance-poster.webp"
          width={1280}
          height={720}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          tabIndex={-1}
          onError={() => setVideoFailed(true)}
          className={`h-full w-full object-cover object-center max-[760px]:object-[68%_center] ${videoFailed ? "hidden" : ""}`}
        />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,28,23,.64),rgba(3,28,23,.12)),linear-gradient(0deg,rgba(3,28,23,.96)_0%,rgba(3,28,23,.62)_44%,rgba(3,28,23,.02)_100%)] max-[760px]:bg-[linear-gradient(0deg,rgba(3,28,23,.98)_0%,rgba(3,28,23,.83)_45%,rgba(3,28,23,.12)_100%)]" />

      <div className="relative mx-auto grid w-[calc(100%_-_128px)] max-w-[1280px] grid-cols-[.85fr_1.15fr] items-center gap-20 pt-44 pb-16 max-[1150px]:w-[calc(100%_-_80px)] max-[1150px]:gap-10 max-[900px]:w-[calc(100%_-_56px)] max-[900px]:gap-7 max-[760px]:w-[calc(100%_-_40px)] max-[760px]:grid-cols-1 max-[760px]:gap-9 max-[760px]:pt-36 max-[760px]:pb-10 max-[370px]:w-[calc(100%_-_32px)]">
        <div className="region-art relative h-[225px] w-full text-[#edce94] max-[760px]:mx-auto max-[760px]:h-[180px] max-[760px]:max-w-[350px]" aria-hidden="true">
          <Mountain className="mountain-art absolute left-[18%] top-1 opacity-25 max-[760px]:-top-3" size={120} strokeWidth={.6} />
          <svg viewBox="0 0 400 170" preserveAspectRatio="none" className="absolute left-0 top-2.5 h-[170px] w-[calc(100%_-_64px)] overflow-visible fill-none">
            <path d="M55 132C100 10 210 190 340 30" className="stroke-[#edce94] stroke-[1.2] [stroke-dasharray:4_6]" />
            <path d="M55 132C100 10 210 190 340 30" className="route-shadow stroke-[#edce94] stroke-[22] opacity-15" />
          </svg>
          <div className="absolute top-[138px] left-[13.75%] z-1 flex -translate-x-1/2 flex-col items-center gap-3.5 text-[11px] font-semibold tracking-[1.3px] max-[900px]:text-[10px]">
            <span className="size-2 rounded-full bg-[#edce94] shadow-[0_0_0_7px_#edce9420,0_0_0_12px_#edce9410]" />
            GARHWAL &amp; KUMAUN
          </div>
          <Send className="route-plane absolute top-[95px] left-[47%] [transform:rotate(22deg)] fill-[#123e31] stroke-[1.3]" size={28} />
          <div className="route-point point-doon absolute top-7.5 right-[4%] z-1 flex flex-col items-center gap-3.5 text-[11px] font-semibold tracking-[1.3px] max-[900px]:text-[10px] max-[760px]:right-0">
            <span className="size-2 rounded-full bg-[#edce94] shadow-[0_0_0_7px_#edce9420,0_0_0_12px_#edce9410]" />
            DEHRADUN
          </div>
        </div>
        <div className="max-w-[710px]">
          <p className="mb-5 flex items-center gap-3 text-[12px] font-semibold tracking-[1.8px] text-[#edce94] max-[760px]:text-[10px] max-[760px]:tracking-[1.3px]">
            <span aria-hidden="true" className="h-px w-7 shrink-0 bg-[#edce94]" />
            DIFFERENT PLACES. ONE SHARED DREAM.
          </p>
          <h2 id="our-roots-heading" className="font-serif text-[clamp(32px,3.2vw,46px)] leading-[1.16] tracking-[-1.2px] max-[760px]:text-[38px] max-[760px]:tracking-[-1px]">
            Your roots stay with you.<br />
            <em className="text-[#edce94]">Your world gets bigger.</em>
          </h2>
          <p lang="gbm" className="mt-6 max-w-[590px] text-[16px] text-[#f4f1e7] max-[760px]:mt-5 max-[760px]:text-[15px]">
            {uttarakhandCopy.region}
          </p>
          <ul aria-label="Uttarakhand admission cities" className="mt-6 flex max-w-[590px] list-none flex-wrap gap-x-3 gap-y-1 border-t border-[#fff3] pt-5 text-[12px] leading-[1.8] text-[#e6e5d8] max-[760px]:gap-x-2.5 max-[760px]:text-[11px]">
            {campaign.driveStops.map((stop, index) => (
              <li key={stop.city} className="flex items-center gap-3 max-[760px]:gap-2.5">
                {index > 0 && <span aria-hidden="true" className="text-[#c5ac7f]">·</span>}
                {stop.city}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
