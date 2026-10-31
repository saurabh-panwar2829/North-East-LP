"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Phone } from "lucide-react";
import { ADMISSION_CITY_LABEL, DRIVE_CITIES, type DriveCity } from "@/lib/enquiry";

export type EnquiryPreset = { drive: DriveCity; region: string };

// The BFC Soccer Schools badge sits over the clip with the scroll hint and dissolves with it once the content rises.
// Content waits off-stage until the striker hits the ball (`data-shot="before"`), then rises in; without motion it is always shown.
const enter = "[transition:opacity_.7s_ease,_translate_.9s_cubic-bezier(.16,_1,_.3,_1)] group-data-[shot=before]/drive:opacity-0 group-data-[shot=before]/drive:translate-y-6 motion-reduce:transition-none";

// Static Tailwind utility groups keep the markup and responsive states readable.
const ui: Record<string, string> = {
  section: "dgs-admission-drive-section group/drive relative isolate overflow-clip bg-[#073c32] text-[#fffbee] scroll-mt-[-62svh] motion-reduce:scroll-mt-0 [@media(scripting:none)]:scroll-mt-0",
  backdrop: "dgs-admission-drive-backdrop sticky top-0 h-svh -mb-[100svh] overflow-hidden pointer-events-none",
  frame: "dgs-admission-drive-frame absolute top-0 right-0 bottom-0 left-0",
  still: "dgs-admission-drive-still object-cover",
  canvas: "dgs-admission-drive-canvas absolute top-0 left-0 w-full h-full opacity-0 [transition:opacity_.6s_ease] [&[data-ready=true]]:opacity-100 motion-reduce:hidden",
  edge: "dgs-admission-drive-edge absolute top-0 right-0 bottom-0 left-0 [background:linear-gradient(180deg,_#052c25a6_0%,_#052c2500_20%,_#052c2500_78%,_#073c32_100%)]",
  veil: "dgs-admission-drive-veil absolute top-0 right-0 bottom-0 left-0 [background:linear-gradient(90deg,_#052c25f7_0%,_#052c25e6_40%,_#052c25c2_68%,_#052c25a8_100%)] [transition:opacity_.9s_ease] group-data-[shot=before]/drive:opacity-0 max-[1100px]:[background:linear-gradient(180deg,_#052c25e6,_#052c25d4)] motion-reduce:transition-none",
  hint: "dgs-admission-drive-hint absolute top-[24svh] left-[max(32px,_calc((100vw_-_1280px)_/_2))] flex items-center gap-3 text-[#fffbee] text-[12px] font-semibold tracking-[2.2px] [text-shadow:0_2px_14px_#000a] opacity-0 [transition:opacity_.5s_ease] group-data-[shot=before]/drive:opacity-100 [&_>_svg]:text-[#e4c990] motion-safe:[&_>_svg]:animate-bounce max-[600px]:left-5 max-[600px]:top-[14svh] max-[600px]:text-[11px]",
  badge: "dgs-admission-drive-badge absolute top-[24svh] right-[max(32px,_calc((100vw_-_1280px)_/_2))] flex items-center gap-3.5 pt-2 pr-4 pb-2 pl-2 [border:1px_solid_#ffffff2e] rounded-[10px] bg-[#052c25b8] [backdrop-filter:blur(12px)] shadow-[0_12px_32px_#00140f4d] text-[#fffbee] opacity-0 [transition:opacity_.7s_ease_.3s] group-data-[shot=before]/drive:opacity-100 group-data-[shot=before]/drive:[transition-delay:0s] motion-reduce:transition-none [&_>_span]:grid [&_>_span]:place-items-center [&_>_span]:flex-none [&_>_span]:h-13 [&_>_span]:rounded-[7px] [&_>_span]:bg-[#fff] [&_>_span]:px-3 [&_>_span]:py-1 [&_img]:w-auto [&_img]:h-8 [&_>_div]:grid [&_>_div]:gap-0.5 [&_b]:text-[10px] [&_b]:font-semibold [&_b]:tracking-[1.8px] [&_b]:text-[#d9c08a] [&_em]:font-serif [&_em]:not-italic [&_em]:text-[15px] [&_em]:leading-[1.25] [&_em]:tracking-[-.2px] [&_em]:whitespace-nowrap max-[600px]:top-[14svh] max-[600px]:right-5 max-[600px]:gap-0 max-[600px]:pr-2 max-[600px]:[&_>_div]:sr-only max-[600px]:[&_>_span]:h-10 max-[600px]:[&_>_span]:px-2 max-[600px]:[&_img]:h-[22px]",
  content: "dgs-admission-drive-content relative z-1 pt-[calc(62svh_+_72px)] pb-18 max-[1100px]:pt-[calc(62svh_+_56px)] max-[1100px]:pb-14 max-[600px]:pt-[calc(62svh_+_44px)] max-[600px]:pb-11 motion-reduce:pt-18 [@media(scripting:none)]:pt-18 group-data-[shot=before]/drive:pointer-events-none",
  ticker: "dgs-admission-drive-ticker relative overflow-hidden bg-[#052c25] text-[#fffbee] [border-block:1px_solid_#c9ae7259] [&::before]:content-[''] [&::before]:absolute [&::before]:top-0 [&::before]:bottom-0 [&::before]:left-0 [&::before]:z-1 [&::before]:w-[12%] [&::before]:[background:linear-gradient(90deg,_#052c25,_#052c2500)] [&::after]:content-[''] [&::after]:absolute [&::after]:top-0 [&::after]:bottom-0 [&::after]:right-0 [&::after]:z-1 [&::after]:w-[12%] [&::after]:[background:linear-gradient(270deg,_#052c25,_#052c2500)] [&::before]:pointer-events-none [&::after]:pointer-events-none",
  tickerTrack: "dgs-admission-drive-tickerTrack flex w-max will-change-transform",
  tickerGroup: "dgs-admission-drive-tickerGroup flex flex-none items-center [&_>_span]:flex [&_>_span]:items-center [&_>_span]:gap-9 [&_>_span]:pr-9 [&_>_span]:pt-[22px] [&_>_span]:pb-[22px] [&_>_span]:whitespace-nowrap [&_b]:font-sans [&_b]:text-[12px] [&_b]:font-semibold [&_b]:tracking-[2.6px] [&_b]:text-[#d9c08a] [&_em]:font-serif [&_em]:not-italic [&_em]:text-[32px] [&_em]:leading-[1] [&_em]:tracking-[-.6px] [&_em]:text-[#fffbee] [&_em[data-tone=gold]]:italic [&_em[data-tone=gold]]:text-[#edd6a4] [&_i]:block [&_i]:flex-none [&_i]:w-[7px] [&_i]:h-[7px] [&_i]:rotate-45 [&_i]:bg-[#c9a35b] max-[600px]:[&_>_span]:gap-6 max-[600px]:[&_>_span]:pr-6 max-[600px]:[&_>_span]:pt-4 max-[600px]:[&_>_span]:pb-4 max-[600px]:[&_em]:text-[24px] max-[600px]:[&_b]:text-[11px] max-[600px]:[&_b]:tracking-[1.8px]",
  layout: "dgs-admission-drive-layout grid grid-cols-[minmax(0,_.92fr)_minmax(0,_1.08fr)] grid-rows-[auto_1fr] gap-x-16 gap-y-10 max-[1150px]:gap-x-10 max-[1100px]:grid-cols-[1fr] max-[1100px]:grid-rows-none max-[1100px]:gap-y-9 max-[600px]:gap-y-8",
  intro: "dgs-admission-drive-intro col-start-1 row-start-1 [&_h2]:text-[clamp(38px,_3.5vw,_52px)] [&_h2]:leading-[1.04] [&_h2]:tracking-[-1.5px] [&_h2_em]:text-[#edd6a4] [&_>_p:not(:first-child)]:mt-5 [&_>_p:not(:first-child)]:max-w-[470px] [&_>_p:not(:first-child)]:text-[#dfe8dc] [&_>_p:not(:first-child)]:text-[16px] [&_>_p:not(:first-child)]:leading-[1.7] max-[1100px]:[&_>_p:not(:first-child)]:max-w-[600px] max-[600px]:[&_h2]:text-[38px] max-[600px]:[&_h2]:tracking-[-1.1px] max-[600px]:[&_>_p:not(:first-child)]:mt-4 max-[600px]:[&_>_p:not(:first-child)]:text-[15px] max-[370px]:[&_h2]:text-[34px]",
  line: "dgs-admission-drive-line inline-block overflow-clip align-bottom pt-[.04em] pb-[.14em] -mt-[.04em] -mb-[.14em] pl-[.08em] pr-[.08em] -ml-[.08em] -mr-[.08em] [&_>_*]:inline-block [&_>_*]:[transition:translate_1.1s_cubic-bezier(.16,_1,_.3,_1)] group-data-[shot=before]/drive:[&_>_*]:translate-y-[115%] motion-reduce:[&_>_*]:transition-none",
  eyebrow: "dgs-admission-drive-eyebrow flex items-center gap-2.5 mb-[19px] text-[#e1d4af] text-[12px] leading-[1.6] font-semibold tracking-[1.8px] [&_>_span]:w-5.5 [&_>_span]:h-[1px] [&_>_span]:flex-none [&_>_span]:bg-[#d8bd79] max-[600px]:text-[11px] max-[600px]:tracking-[.6px] max-[600px]:mb-4 max-[600px]:[&_>_span]:w-4",
  actions: "dgs-admission-drive-actions flex flex-wrap items-center gap-x-6 gap-y-3 mt-7 max-[600px]:mt-6",
  register: "dgs-admission-drive-register inline-flex items-center justify-center gap-5 min-h-12 pt-3 pr-5 pb-3 pl-5 [border:1px_solid_#e7c78d] rounded-[4px] bg-[#ecd2a0] text-[#143c30] text-[15px] font-[650] [transition:background_.25s_ease] [&:hover]:bg-[#f7dfb3] [&_>_svg]:[transition:transform_.25s_ease] [&:hover_>_svg]:[transform:translate(2px,_-2px)] max-[600px]:w-full max-[600px]:justify-between motion-reduce:transition-none motion-reduce:[&_>_svg]:transition-none",
  call: "dgs-admission-drive-call inline-flex items-center gap-2.5 text-[#f3e3c0] text-[15px] font-medium [border-bottom:1px_solid_#e7c78d66] pt-1.5 pb-1.5 [&_>_svg]:text-[#dec68b] [&:hover]:text-[#fff2cd]",
  panel: "dgs-admission-drive-panel col-start-2 row-start-1 row-span-2 flex flex-col overflow-hidden [border:1px_solid_#ffffff2e] rounded-[10px] bg-[#052c25bf] [backdrop-filter:blur(14px)] shadow-[0_24px_60px_#00140f59] [transition:opacity_.8s_ease_.18s,_translate_1s_cubic-bezier(.16,_1,_.3,_1)_.18s] group-data-[shot=before]/drive:opacity-0 group-data-[shot=before]/drive:translate-y-10 max-[1100px]:col-start-1 max-[1100px]:row-start-2 max-[1100px]:row-span-1 motion-reduce:transition-none",
  panelHead: "dgs-admission-drive-panelHead flex items-center justify-between gap-4 pt-4 pr-6 pb-4 pl-6 [border-bottom:1px_solid_#ffffff1f] text-[#e1d4af] text-[12px] font-semibold tracking-[1.6px] max-[600px]:pl-4 max-[600px]:pr-4 max-[600px]:text-[11px] max-[600px]:tracking-[1.1px]",
  status: "dgs-admission-drive-status inline-flex items-center gap-2 pt-1.5 pr-3 pb-1.5 pl-2.5 [border:1px_solid_#ffffff26] rounded-full bg-[#ffffff0d] text-[#f3e3c0] text-[12px] font-medium tracking-normal whitespace-nowrap [&_>_span]:w-2 [&_>_span]:h-2 [&_>_span]:rounded-full [&_>_span]:bg-[#9fd08a] [&_>_span]:shadow-[0_0_0_4px_#9fd08a26] motion-safe:[&_>_span]:animate-pulse",
  stops: "dgs-admission-drive-stops flex-1 grid [grid-auto-rows:1fr] [&_>_li]:min-h-0 [&_>_li]:[transition:opacity_.6s_ease,_translate_.8s_cubic-bezier(.16,_1,_.3,_1)] group-data-[shot=before]/drive:[&_>_li]:opacity-0 group-data-[shot=before]/drive:[&_>_li]:translate-x-8 motion-reduce:[&_>_li]:transition-none",
  stop: "dgs-admission-drive-stop grid w-full h-full items-center gap-x-6 gap-y-1 [grid-template-columns:minmax(0,_1fr)_auto_auto] [grid-template-areas:'city_date_action'] pt-4 pr-6 pb-4 pl-6 [border:0] [border-bottom:1px_solid_#ffffff14] bg-transparent text-left text-[#fffbee] [transition:background_.25s_ease] [&:hover]:bg-[#ffffff0d] [&:hover_.dgs-admission-drive-arrow]:bg-[#ecd2a0] [&:hover_.dgs-admission-drive-arrow]:text-[#143c30] [&:hover_.dgs-admission-drive-arrow]:[border-color:#ecd2a0] max-[600px]:[grid-template-columns:minmax(0,_1fr)_auto] max-[600px]:[grid-template-areas:'city_action'_'date_action'] max-[600px]:gap-x-4 max-[600px]:pl-4 max-[600px]:pr-4 motion-reduce:transition-none",
  city: "dgs-admission-drive-city [grid-area:city] min-w-0 [&_>_span]:block [&_>_span:first-child]:font-serif [&_>_span:first-child]:text-[26px] [&_>_span:first-child]:leading-[1.1] [&_>_span:first-child]:tracking-[-.4px] [&_>_span:last-child]:mt-1 [&_>_span:last-child]:text-[#b8caba] [&_>_span:last-child]:text-[12px] [&_>_span:last-child]:font-semibold [&_>_span:last-child]:tracking-[1.3px] max-[600px]:[&_>_span:first-child]:text-[23px] max-[600px]:[&_>_span:last-child]:text-[11px] max-[600px]:[&_>_span:last-child]:tracking-[1px]",
  date: "dgs-admission-drive-date [grid-area:date] flex items-center gap-2 text-[14px] text-[#fffbee] whitespace-nowrap [&[data-pending=true]]:text-[#edd6a4] [&_>_svg]:flex-none [&_>_svg]:text-[#dec68b] max-[600px]:mt-1.5 max-[600px]:text-[13px] max-[600px]:whitespace-normal",
  action: "dgs-admission-drive-action [grid-area:action] flex items-center gap-3 text-[#f3e3c0] text-[14px] font-semibold",
  arrow: "dgs-admission-drive-arrow grid place-items-center w-9 h-9 flex-none [border:1px_solid_#e7c78d80] rounded-full [transition:background_.25s_ease,_color_.25s_ease,_border-color_.25s_ease] motion-reduce:transition-none",
  elsewhere: "dgs-admission-drive-elsewhere mt-auto flex items-center justify-between gap-5 pt-5 pr-6 pb-5 pl-6 bg-[#f3f2e9] text-[#163f33] [&_p:first-child]:font-serif [&_p:first-child]:text-[21px] [&_p:first-child]:leading-[1.2] [&_p:first-child_em]:text-[#687552] [&_p_+_p]:mt-1 [&_p_+_p]:text-[#55634f] [&_p_+_p]:text-[14px] [&_p_+_p]:leading-[1.5] max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-4 max-[600px]:pl-4 max-[600px]:pr-4",
  talk: "dgs-admission-drive-talk inline-flex items-center gap-3 flex-none min-h-11 pt-2.5 pr-4 pb-2.5 pl-4 [border:1px_solid_#073c32] rounded-[4px] bg-[#073c32] text-[#fffbee] text-[14px] font-semibold [transition:background_.25s_ease] [&:hover]:bg-[#15513d] [&_>_svg]:text-[#e5c37a] motion-reduce:transition-none",
  steps: "dgs-admission-drive-steps col-start-1 row-start-2 self-end max-[1100px]:row-start-3 max-[1100px]:self-auto [&_>_h3]:flex [&_>_h3]:items-center [&_>_h3]:gap-2.5 [&_>_h3]:mb-5 [&_>_h3]:text-[#e1d4af] [&_>_h3]:text-[12px] [&_>_h3]:font-semibold [&_>_h3]:tracking-[1.8px] [&_>_h3_>_span]:w-5.5 [&_>_h3_>_span]:h-[1px] [&_>_h3_>_span]:bg-[#d8bd79] max-[600px]:[&_>_h3]:text-[11px] max-[600px]:[&_>_h3]:tracking-[1.3px]",
  stepList: "dgs-admission-drive-stepList grid gap-y-4.5 max-[1100px]:grid-cols-[repeat(4,_minmax(0,_1fr))] max-[1100px]:gap-x-6 max-[800px]:grid-cols-[repeat(2,_minmax(0,_1fr))] max-[800px]:gap-y-6 max-[600px]:grid-cols-[1fr] max-[600px]:gap-y-4.5",
  step: "dgs-admission-drive-step relative grid grid-cols-[32px_minmax(0,_1fr)] gap-x-4 items-start [&:not(:last-child)::after]:content-[''] [&:not(:last-child)::after]:absolute [&:not(:last-child)::after]:left-[15px] [&:not(:last-child)::after]:top-8 [&:not(:last-child)::after]:bottom-[-18px] [&:not(:last-child)::after]:w-[1px] [&:not(:last-child)::after]:bg-[#ffffff26] max-[1100px]:[&::after]:hidden max-[600px]:[&::after]:block [&_>_span]:relative [&_>_span]:z-1 [&_>_span]:grid [&_>_span]:place-items-center [&_>_span]:w-8 [&_>_span]:h-8 [&_>_span]:rounded-full [&_>_span]:[border:1px_solid_#d8bd7966] [&_>_span]:bg-[#073c32] [&_>_span]:font-serif [&_>_span]:text-[14px] [&_>_span]:text-[#e4c990] [&_strong]:block [&_strong]:pt-1 [&_strong]:text-[16px] [&_strong]:font-semibold [&_strong]:leading-[1.35] [&_p]:mt-1 [&_p]:text-[#c0d0bf] [&_p]:text-[14px] [&_p]:leading-[1.6]",
};


// Add each confirmed date and venue here. An empty date shows “Date to be announced”.
const stops = DRIVE_CITIES.map(city => ({ city, date: "", venue: "" }));

const steps = [
  { title: "Register your city", description: "Share a few details. It takes about a minute." },
  { title: "Hear from admissions", description: "The team confirms the venue, date and time." },
  { title: "Meet the team", description: "Discuss classes, boarding, fees and documents." },
  { title: "Plan the next step", description: "Assessment where applicable, a Principal interaction and a campus visit." },
];

// Background frames of an illustrative clip generated from public/images/life-at-dgs/sports.webp: run-up, strike, follow-through.
// Scrolling plays them like a flip-book. Frame index 27 is the strike: the section's content arrives with it, and it is the still without motion.
const FRAME_COUNT = 48;
const STRIKE_FRAME = 27;
const FOCUS_X = .58;
const frameSource = (index: number) => `/images/football-shot/frame-${String(index + 1).padStart(3, "0")}.webp`;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

// Coarse frames first, then the gaps, so scrubbing works early on slow connections and sharpens as the rest arrive.
function loadOrder() {
  const order: number[] = [];
  for (let step = 8; step >= 1; step /= 2) for (let index = 0; index < FRAME_COUNT; index += step) if (!order.includes(index)) order.push(index);
  return order;
}

export default function AdmissionDrive({ onRegister, onEnquire }: { onRegister: (preset: EnquiryPreset) => void; onEnquire: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickerItems = [{ text: "NORTH EAST ADMISSION DRIVE · 2027–28", label: true }, ...stops.map(({ city }) => ({ text: city, label: false })), { text: "REGISTRATIONS OPEN", label: true }];

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !canvas || !context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frames: HTMLImageElement[] = [];
    let current = -1;
    let frame = 0;
    let loading = false;

    function draw(index: number) {
      if (!canvas || !context) return;
      let image: HTMLImageElement | undefined;
      for (let offset = 0; offset < FRAME_COUNT && !image; offset++) {
        for (const candidate of [frames[index - offset], frames[index + offset]]) if (candidate?.complete && candidate.naturalWidth) { image = candidate; break; }
      }
      if (!image) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = Math.round(canvas.clientWidth * ratio);
      const height = Math.round(canvas.clientHeight * ratio);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      // Cover the backdrop, keeping the player in view when the crop is narrower than the clip.
      const x = Math.min(0, Math.max(width - drawWidth, width / 2 - FOCUS_X * drawWidth));
      context.drawImage(image, x, (height - drawHeight) / 2, drawWidth, drawHeight);
      canvas.dataset.ready = "true";
    }

    function load() {
      if (loading) return;
      loading = true;
      for (const index of loadOrder()) {
        const image = new window.Image();
        image.decoding = "async";
        image.onload = () => draw(Math.max(current, 0));
        image.src = frameSource(index);
        frames[index] = image;
      }
    }

    // The run-up plays across the pre-roll while the section fills the screen; the strike lands as the content rises into view, and the content follows it in.
    function update() {
      frame = 0;
      if (!section) return;
      if (motion.matches) { delete section.dataset.shot; return; }
      const viewport = window.innerHeight;
      const progress = clamp((viewport * .6 - section.getBoundingClientRect().top) / (viewport * 1.6));
      const index = Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1)));
      if (index !== current) { current = index; draw(index); }
      const focused = section.contains(document.activeElement);
      if (index >= STRIKE_FRAME || focused) section.dataset.shot = "after";
      else if (index <= STRIKE_FRAME - 3) section.dataset.shot = "before";
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = () => { current = -1; schedule(); };
    const focus = (event: FocusEvent) => { if (event.target instanceof Node && section.contains(event.target)) section.dataset.shot = "after"; };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || motion.matches) return;
      load();
      observer.disconnect();
    }, { rootMargin: "150% 0px" });
    observer.observe(section);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("focusin", focus);
    motion.addEventListener("change", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      document.removeEventListener("focusin", focus);
      motion.removeEventListener("change", schedule);
      delete section.dataset.shot;
    };
  }, []);

  return (
    <>
    <div className={ui.ticker} aria-hidden="true">
      <div className={ui.tickerTrack}>
        {[0, 1, 2].map(copy => <div className={ui.tickerGroup} key={copy}>{tickerItems.map(({ text, label }, index) => <span key={text}>{label ? <b>{text}</b> : <em data-tone={index % 2 ? undefined : "gold"}>{text}</em>}<i /></span>)}</div>)}
      </div>
    </div>
    <section ref={sectionRef} className={ui.section} id="admission-drive" aria-labelledby="admission-drive-heading" data-no-split>
      <div className={ui.backdrop}>
        <div className={ui.frame}>
          <Image className={ui.still} src={frameSource(STRIKE_FRAME)} alt="" fill sizes="100vw" style={{ objectPosition: `${FOCUS_X * 100}% center` }} />
          <canvas ref={canvasRef} className={ui.canvas} aria-hidden="true" />
        </div>
        <div className={ui.edge} />
        <div className={ui.veil} />
        <p className={ui.hint} aria-hidden="true">SCROLL TO TAKE THE SHOT <ChevronDown size={16} /></p>
        <div className={ui.badge}>
          <span><Image src="/images/bfc-soccer-schools.webp" alt="BFC Soccer Schools" width={122} height={32} /></span>
          <div><b>FOOTBALL PROGRAMME</b><em>In association with<br />BFC Soccer Schools</em></div>
        </div>
      </div>
      <div className={`dgs-container w-[calc(100%_-_128px)] max-w-[1280px] ml-auto mr-auto max-[1150px]:w-[calc(100%_-_80px)] max-[900px]:w-[calc(100%_-_56px)] max-[760px]:w-[calc(100%_-_40px)] max-[370px]:w-[calc(100%_-_32px)] ${ui.content}`}>
        <div className={ui.layout}>
          <div className={ui.intro}>
            <p className={`${ui.eyebrow} ${enter}`}><span aria-hidden="true" /> NORTH EAST ADMISSION DRIVE · 2027–28</p>
            <h2 id="admission-drive-heading"><span className={ui.line}><span>Meet DGS admissions,</span></span><br /><span className={ui.line}><em style={{ transitionDelay: "110ms" }}>closer to home.</em></span></h2>
            <p className={enter} style={{ transitionDelay: "160ms" }}>The admissions team is meeting families in {ADMISSION_CITY_LABEL}. Register for your city and we’ll share the venue, date and time once confirmed.</p>
            <div className={`${ui.actions} ${enter}`} style={{ transitionDelay: "240ms" }}>
              <button className={ui.register} onClick={onEnquire} aria-haspopup="dialog">Register your interest <ArrowUpRight size={18} aria-hidden="true" /></button>
              <a className={ui.call} href="tel:+917455997333"><Phone size={16} aria-hidden="true" /> +91 74559 97333</a>
            </div>
          </div>

          <div className={ui.panel}>
            <div className={ui.panelHead}><span>DRIVE CITIES · 2027–28</span><span className={ui.status}><span aria-hidden="true" /> Registrations open</span></div>
            <ul className={ui.stops} aria-label="Admission drive cities">
              {stops.map(({ city, date, venue }, index) => (
                <li key={city} style={{ transitionDelay: `${300 + index * 70}ms` }}>
                  <button className={ui.stop} onClick={() => onRegister({ drive: city, region: city })} aria-haspopup="dialog" aria-label={`Register for the ${city} admission drive`} aria-describedby={`drive-${city}-date`}>
                    <span className={ui.city}><span>{city}</span><span>MEET THE ADMISSIONS TEAM</span></span>
                    <span className={ui.date} id={`drive-${city}-date`} data-pending={!date}><CalendarDays size={15} aria-hidden="true" />{date ? `${date}${venue ? ` · ${venue}` : ""}` : "Date to be announced"}</span>
                    <span className={ui.action}><span>Register</span><span className={ui.arrow}><ArrowUpRight size={16} aria-hidden="true" /></span></span>
                  </button>
                </li>
              ))}
            </ul>
            <div className={ui.elsewhere}>
              <div>
                <p>Questions about <em>the admission drive?</em></p>
                <p>Speak with our team about your city’s session.</p>
              </div>
              <button className={ui.talk} onClick={onEnquire} aria-haspopup="dialog">Talk to admissions <ArrowUpRight size={16} aria-hidden="true" /></button>
            </div>
          </div>

          <div className={`${ui.steps} ${enter}`} style={{ transitionDelay: "420ms" }}>
            <h3><span aria-hidden="true" /> HOW THE DRIVE WORKS</h3>
            <ol className={ui.stepList}>
              {steps.map(({ title, description }, index) => (
                <li className={ui.step} key={title}>
                  <span aria-hidden="true">{index + 1}</span>
                  <div><strong>{title}</strong><p>{description}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
