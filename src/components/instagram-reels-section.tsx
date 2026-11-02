"use client";

import { getRegionalCopy } from "@/lib/regional-copy";

import Image from "next/image";
import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Instagram, Play, VolumeX } from "lucide-react";
import { useCampaign } from "@/components/campaign-context";

// Latin-only cut of Kalam for the handwritten notes; the full Devanagari Kalam stays on the regional layouts.
const hand = localFont({
  src: [
    { path: "../../public/fonts/kalam-latin.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/kalam-latin-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

const grain = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Static Tailwind utility groups keep the markup and responsive states readable.
// The section reads as a chalkboard: reels are taped-up polaroids that straighten when watched.
// Wide screens fit them all in one overlapping row; tablets and phones swipe through them.
const ui: Record<string, string> = {
  section: "dgs-instagram-reels-section relative overflow-hidden pt-22 pb-24 [background:radial-gradient(ellipse_at_18%_12%,_#ffffff0d,_transparent_42%),_radial-gradient(ellipse_at_82%_72%,_#ffffff0a,_transparent_45%),_radial-gradient(ellipse_at_100%_0%,_#0f4d3d,_transparent_55%),_#042d24] text-[#fffdf3] max-[900px]:pt-16 max-[900px]:pb-20 max-[600px]:pt-12 max-[600px]:pb-14",
  grain: "dgs-instagram-reels-grain pointer-events-none absolute inset-0 opacity-[.07] [background-size:160px]",
  heading: "dgs-instagram-reels-heading flex justify-between items-end gap-12 mb-8 [&_h2]:text-[clamp(38px,_3.7vw,_54px)] [&_h2]:leading-[1.04] [&_h2]:tracking-[-1.7px] [&_h2_em]:text-[#e8d2a0] [&[data-pinned=pending]_[data-draw]]:opacity-0 max-[900px]:block max-[600px]:mb-6 max-[600px]:[&_h2]:text-[38px] max-[600px]:[&_h2]:tracking-[-1.2px]",
  title: "dgs-instagram-reels-title relative w-fit text-[clamp(38px,_3.7vw,_54px)] max-[600px]:text-[38px]",
  underline: "dgs-instagram-reels-underline absolute -left-[.05em] -bottom-[.3em] w-[4.6em] h-[.45em] overflow-visible fill-none stroke-[#e8d2a0] [stroke-width:2.4] [stroke-linecap:round] [stroke-dasharray:1] [filter:url(#reels-chalk)]",
  star: "dgs-instagram-reels-star absolute -right-[.85em] top-[.05em] w-[.55em] h-[.55em] overflow-visible fill-none stroke-[#e8d2a0] [stroke-width:1.5] [stroke-linejoin:round] [stroke-dasharray:1] [filter:url(#reels-chalk)]",
  eyebrow: "dgs-instagram-reels-eyebrow flex items-center gap-2 text-[13px] font-[650] leading-[1.5] tracking-[1.65px] text-[#f4f1df] mb-[17px] [&_>_span]:w-[17px] [&_>_span]:h-[1px] [&_>_span]:bg-[#edbe66] max-[600px]:text-[12px] max-[600px]:tracking-[1.4px] max-[600px]:mb-[15px]",
  aside: "dgs-instagram-reels-aside max-w-[400px] pb-1 max-[900px]:max-w-[560px] max-[900px]:mt-6",
  description: "dgs-instagram-reels-description text-[16px] leading-[1.75] text-[#c0d0bf] max-[600px]:text-[15px]",
  follow: "dgs-instagram-reels-follow inline-flex items-center gap-2.5 min-h-11.5 mt-6 pt-3 pr-4.5 pb-3 pl-4 [border:1px_solid_#e7c78d80] rounded-[5px] text-[#fffbee] text-[15px] font-[550] [transition:background_.25s_ease,_border-color_.25s_ease] [&_>_svg]:text-[#e8d2a0] [&_>_svg:last-child]:[transition:transform_.25s_ease] [&:hover]:bg-[#ffffff0d] [&:hover]:[border-color:#e7c78d] [&:hover_>_svg:last-child]:[transform:translate(2px,_-2px)] max-[600px]:mt-5 max-[370px]:text-[14px] max-[370px]:pl-3 max-[370px]:pr-3 motion-reduce:transition-none",
  board: "dgs-instagram-reels-board [&[data-pinned=pending]_.dgs-instagram-reels-polaroid]:opacity-0 [&[data-pinned=pending]_[data-draw]]:opacity-0",
  hint: "dgs-instagram-reels-hint flex items-end justify-end gap-1 pr-[7%] text-[#efe9d6d9] text-[21px] leading-[1.15] [font-family:var(--font-hand),cursive] [rotate:-2deg] [&_svg]:flex-none [&_svg]:w-[54px] [&_svg]:h-[46px] [&_svg]:-mb-5 [&_svg]:overflow-visible [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-width:2] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-dasharray:1] [&_svg]:[filter:url(#reels-chalk)] max-[760px]:justify-start max-[760px]:pr-0 max-[760px]:pl-2 max-[760px]:text-[18px]",
  wall: "dgs-instagram-reels-wall relative flex items-start pt-7 pb-4 min-[1151px]:justify-center min-[1151px]:px-1.5 min-[1151px]:mx-[calc(50%_-_50vw_+_24px)] max-[1150px]:gap-4 max-[1150px]:mx-[calc(50%_-_50vw)] min-[761px]:max-[1150px]:px-8 min-[761px]:max-[1150px]:scroll-px-8 max-[760px]:px-[calc((100vw_-_min(270px,_68vw))_/_2)] max-[1150px]:pt-8 max-[1150px]:pb-8 max-[1150px]:overflow-x-auto max-[1150px]:overscroll-x-contain max-[1150px]:snap-x max-[1150px]:snap-mandatory max-[1150px]:[scrollbar-width:none] max-[1150px]:[&::-webkit-scrollbar]:hidden",
  polaroid: "dgs-instagram-reels-polaroid group relative z-0 flex-none pt-[10px] pr-[10px] pb-0 pl-[10px] rounded-[3px] bg-[#fbf7ec] shadow-[0_20px_36px_#0000005c,_0_2px_5px_#00000033] [rotate:var(--tilt)] [transition:rotate_.55s_cubic-bezier(.34,_1.4,_.64,_1),_scale_.55s_cubic-bezier(.34,_1.4,_.64,_1),_translate_.55s_cubic-bezier(.34,_1.4,_.64,_1),_box-shadow_.4s_ease] hover:z-10 hover:[rotate:0deg] hover:scale-[1.12] hover:-translate-y-3 hover:shadow-[0_34px_60px_#00000073,_0_3px_8px_#00000033] focus-within:z-10 focus-within:[rotate:0deg] focus-within:scale-[1.12] data-[audible=true]:z-10 data-[audible=true]:[rotate:0deg] data-[audible=true]:scale-[1.12] data-[audible=true]:-translate-y-3 min-[1151px]:flex-1 min-[1151px]:min-w-0 min-[1151px]:max-w-[272px] min-[1151px]:-mx-1.5 min-[1151px]:mt-[var(--drop)] min-[1151px]:[&:not(:last-child)_.dgs-instagram-reels-note]:pr-8 max-[1150px]:w-[min(270px,_68vw)] min-[761px]:max-[1150px]:snap-start max-[760px]:snap-center max-[1150px]:transition-none motion-reduce:transition-none",
  tape: "dgs-instagram-reels-tape absolute z-2 left-1/2 -top-[13px] w-[92px] h-[27px] [translate:-50%_0] [rotate:var(--tape-tilt)] [background:linear-gradient(180deg,_#ffffff40,_transparent_70%),_var(--tape)] [clip-path:polygon(3%_0,_97%_0,_100%_22%,_96%_45%,_100%_68%,_96%_100%,_4%_100%,_0_78%,_4%_55%,_0_32%)]",
  photo: "dgs-instagram-reels-photo relative isolate aspect-[9/16] overflow-hidden rounded-[2px] bg-[#0b3a2f] [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_img]:object-cover",
  note: "dgs-instagram-reels-note flex flex-col justify-center min-h-[84px] pt-2.5 pr-1.5 pb-3 pl-1.5 [font-family:var(--font-hand),cursive] [&_h3]:text-[20px] [&_h3]:font-bold [&_h3]:leading-[1.15] [&_h3]:text-[#21362e] [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 [&_a]:w-fit [&_a]:mt-1 [&_a]:text-[15px] [&_a]:leading-[1.2] [&_a]:text-[#a07c3f] [&_a]:underline-offset-[3px] [&_a:hover]:text-[#7a5a26] [&_a:hover]:underline [&_a_svg]:opacity-75 min-[1151px]:[&_h3]:text-[clamp(15px,_1.25vw,_19px)] min-[1151px]:[&_a]:text-[clamp(12px,_1vw,_15px)]",
  tap: "dgs-instagram-reels-tap absolute inset-0 flex items-center justify-center w-full h-full [border:0] bg-transparent text-[#fffdf3] [&:focus-visible]:outline-offset-[-4px]!",
  play: "dgs-instagram-reels-play grid place-items-center w-13 h-13 rounded-full bg-[#00000059] [backdrop-filter:blur(6px)] [border:1px_solid_#ffffff40] [&_>_svg]:ml-1 [&_>_svg]:fill-current",
  sound: "dgs-instagram-reels-sound absolute left-2.5 top-2.5 inline-flex items-center h-8 pt-0 pr-2 pb-0 pl-2 rounded-full bg-[#00000066] [backdrop-filter:blur(6px)] text-[12px] font-semibold tracking-[.3px]",
  soundLabel: "dgs-instagram-reels-soundLabel max-w-0 overflow-hidden whitespace-nowrap [transition:max-width_.35s_ease,_margin_.35s_ease] group-hover:max-w-[110px] group-hover:ml-1.5 motion-reduce:transition-none",
  bars: "dgs-instagram-reels-bars flex items-end justify-center gap-[2px] w-4 h-3.5 [&_>_i]:w-[3px] [&_>_i]:h-full [&_>_i]:rounded-full [&_>_i]:bg-[#edbe66] [&_>_i]:origin-bottom [&_>_i]:animate-equalize [&_>_i:nth-child(2)]:[animation-delay:-.45s] [&_>_i:nth-child(3)]:[animation-delay:-.2s]",
  progress: "dgs-instagram-reels-progress absolute left-0 right-0 bottom-0 h-[3px] bg-[#ffffff2e] [&_>_span]:block [&_>_span]:h-full [&_>_span]:bg-[#edbe66] [&_>_span]:origin-left [&_>_span]:scale-x-0 [&_>_span]:[transition:scale_.25s_linear]",
  watch: "dgs-instagram-reels-watch absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#fffdf3] text-[13px] font-[550] [background:linear-gradient(#0000,_#0000_45%,_#00000073)] [&_>_span:last-child]:absolute [&_>_span:last-child]:left-0 [&_>_span:last-child]:right-0 [&_>_span:last-child]:bottom-3.5 [&_>_span:last-child]:inline-flex [&_>_span:last-child]:items-center [&_>_span:last-child]:justify-center [&_>_span:last-child]:gap-2",
  empty: "dgs-instagram-reels-empty grid place-content-center justify-items-center gap-3 aspect-[9/16] [border:1.5px_dashed_#21362e40] rounded-[2px] text-[#21362e99] [&_>_span]:grid [&_>_span]:place-items-center [&_>_span]:w-12 [&_>_span]:h-12 [&_>_span]:[border:1px_solid_#21362e33] [&_>_span]:rounded-full",
};

type Reel = { tag: string; title: string; link: string; cover: string; video?: string };

// Reel videos and covers live in public/videos/reels. A reel without a video (Instagram withholds
// reels that use licensed music) shows its cover and opens on Instagram; a null entry shows a "coming soon" polaroid.
const reels: Array<Reel | null> = [
  { tag: "achievers", title: "Vedanshi clears MNS 2026!", link: "https://www.instagram.com/reel/DeV83erBfKv/", cover: "/videos/reels/vedanshi-mns-cover.webp", video: "/videos/reels/vedanshi-mns.mp4" },
  { tag: "celebrations", title: "Children’s Day smiles", link: "https://www.instagram.com/reel/DROoXC9gfZR/", cover: "/videos/reels/childrens-day-cover.webp", video: "/videos/reels/childrens-day.mp4" },
  { tag: "studentvoices", title: "A new city, new beginnings", link: "https://www.instagram.com/reel/DeR6lEuPpVq/", cover: "/videos/reels/new-city-new-beginnings-cover.webp", video: "/videos/reels/new-city-new-beginnings.mp4" },
  { tag: "studentvoices", title: "Mahi on happy learning", link: "https://www.instagram.com/reel/DdS8h6MMl3o/", cover: "/videos/reels/happy-learning-cover.webp", video: "/videos/reels/happy-learning.mp4" },
  { tag: "classroom", title: "Cups, patterns & AP!", link: "https://www.instagram.com/reel/DcbX1o9v2hW/", cover: "/videos/reels/cup-pattern-challenge-cover.webp", video: "/videos/reels/cup-pattern-challenge.mp4" },
  { tag: "ptm", title: "Partners in learning", link: "https://www.instagram.com/reel/DavFogSvQ4U/", cover: "/videos/reels/parent-teacher-meeting-cover.webp", video: "/videos/reels/parent-teacher-meeting.mp4" },
  { tag: "labourday", title: "Thank you, silent heroes!", link: "https://www.instagram.com/reel/DXyXVzJO69w/", cover: "/videos/reels/labour-day-cover.webp", video: "/videos/reels/labour-day.mp4" },
];

// Resting tilt, drop below the row line and tape for each polaroid, repeating for longer lists.
const layout = [
  { tilt: -3, drop: 0, tape: "#ecd29ed9", tapeTilt: -5 },
  { tilt: 2.5, drop: 34, tape: "#c6d4b0d9", tapeTilt: 4 },
  { tilt: -2, drop: 8, tape: "#efc9b6d9", tapeTilt: -3 },
  { tilt: 3, drop: 40, tape: "#ecd29ed9", tapeTilt: 6 },
  { tilt: -2.5, drop: 30, tape: "#c6d4b0d9", tapeTilt: -4 },
  { tilt: 2, drop: 4, tape: "#efc9b6d9", tapeTilt: 3 },
  { tilt: -1.5, drop: 36, tape: "#ecd29ed9", tapeTilt: -6 },
  { tilt: 2.8, drop: 10, tape: "#c6d4b0d9", tapeTilt: 5 },
];

const profile = "https://www.instagram.com/thedoonglobal_school/";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease = "cubic-bezier(.34, 1.3, .64, 1)";

// Chalk lines draw themselves in; polaroids drop onto the board one after another, then their tape sticks down.
function drawChalk(group: HTMLElement, animations: Animation[], delay = 0) {
  group.querySelectorAll("[data-draw]").forEach((path, index) => {
    animations.push(path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, delay: delay + index * 160, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "backwards" }));
  });
}

function pinPolaroids(group: HTMLElement, animations: Animation[]) {
  group.querySelectorAll<HTMLElement>(".dgs-instagram-reels-polaroid").forEach((card, index) => {
    const turn = index % 2 ? 13 : -13;
    animations.push(card.animate([{ opacity: 0, transform: `translate3d(0, -70px, 0) rotate(${turn}deg) scale(1.2)` }, { opacity: 1, transform: "none" }], { duration: 750, delay: index * 90, easing: ease, fill: "backwards" }));
    const tape = card.querySelector(".dgs-instagram-reels-tape");
    if (tape) animations.push(tape.animate([{ opacity: 0, scale: "0 1" }, { opacity: 1, scale: "1 1" }], { duration: 320, delay: index * 90 + 520, easing: "ease-out", fill: "backwards" }));
  });
  drawChalk(group, animations, 500);
}

// Plays muted like a reel feed: while hovered with a mouse, or while centred on touch screens.
// A tap turns the sound on, which mutes every other reel.
function ReelVideo({ reel, video: src, active, audible, onSound }: { reel: Reel; video: string; active: boolean; audible: boolean; onSound: (audible: boolean) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !audible;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    let visible = false;
    const sync = () => {
      const wanted = audible || (!motion.matches && (mouse.matches ? active : true));
      if (visible && !document.hidden && wanted) video.play().catch(() => { /* Keep the cover if autoplay is blocked. */ });
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .6 });
    observer.observe(video);
    motion.addEventListener("change", sync);
    mouse.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      mouse.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [active, audible]);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    // Unmute and play inside the tap itself so mobile browsers allow sound.
    video.muted = audible;
    if (!audible) video.play().catch(() => {});
    onSound(!audible);
  }

  function trackProgress(video: HTMLVideoElement) {
    const bar = progressRef.current;
    if (!bar || !video.duration) return;
    const progress = video.currentTime / video.duration;
    // Snap back without easing when the reel loops.
    bar.style.transition = progress < Number(bar.dataset.progress || 0) ? "none" : "";
    bar.dataset.progress = String(progress);
    bar.style.scale = `${progress} 1`;
  }

  return (
    <>
      <video ref={videoRef} src={src} poster={reel.cover} muted loop playsInline preload="none" disablePictureInPicture aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={event => trackProgress(event.currentTarget)} />
      <button type="button" className={ui.tap} aria-label={`${audible ? "Mute" : "Play with sound"}: ${reel.title}`} aria-pressed={audible} onClick={toggleSound}>
        {!playing && <span className={ui.play} aria-hidden="true"><Play size={22} /></span>}
        <span className={ui.sound} aria-hidden="true">
          {audible ? <span className={ui.bars}><i /><i /><i /></span> : <VolumeX size={16} />}
          <span className={ui.soundLabel}>{audible ? "Sound on" : "Tap for sound"}</span>
        </span>
      </button>
      <span className={ui.progress} aria-hidden="true"><span ref={progressRef} /></span>
    </>
  );
}

export default function InstagramReelsSection() {
  const campaign = useCampaign();
  const copy = getRegionalCopy(campaign.id);
  const headingRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [audible, setAudible] = useState<number | null>(null);

  // Below-the-fold chalk and polaroids wait off the board until they scroll into view.
  useEffect(() => {
    const heading = headingRef.current;
    const board = boardRef.current;
    if (!heading || !board || reducedMotion() || !("IntersectionObserver" in window)) return;
    const animations: Animation[] = [];
    const groups = [heading, board].filter(group => group.getBoundingClientRect().top > window.innerHeight * .92);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const group = entry.target as HTMLElement;
        observer.unobserve(group);
        delete group.dataset.pinned;
        if (group === board) pinPolaroids(group, animations);
        else drawChalk(group, animations, 350);
      }
    }, { threshold: .15 });
    for (const group of groups) {
      group.dataset.pinned = "pending";
      observer.observe(group);
    }
    return () => {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
      for (const group of groups) delete group.dataset.pinned;
    };
  }, []);

  // On phones the wall becomes a swipeable strip: the centred polaroid straightens, its neighbours stay tilted and small.
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(wall.querySelectorAll<HTMLElement>(".dgs-instagram-reels-polaroid"));
    let frame = 0;
    function update() {
      frame = 0;
      if (!wall) return;
      const strip = getComputedStyle(wall).overflowX !== "visible";
      cards.forEach((card, index) => {
        if (!strip || motion.matches) {
          card.style.rotate = "";
          card.style.scale = "";
          return;
        }
        const offset = Math.abs(card.offsetLeft + card.offsetWidth / 2 - wall.scrollLeft - wall.clientWidth / 2) / card.offsetWidth;
        const focus = clamp(1 - offset);
        card.style.rotate = `${(layout[index % layout.length].tilt * (1 - focus)).toFixed(2)}deg`;
        card.style.scale = (.9 + .1 * focus).toFixed(3);
      });
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    wall.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      wall.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section className={`${ui.section} ${hand.variable}`} id="reels" aria-labelledby="reels-heading">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="reels-chalk"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" /></filter>
      </svg>
      <div className={ui.grain} style={{ backgroundImage: grain }} aria-hidden="true" />
      <div className={"dgs-container relative w-[calc(100%_-_128px)] max-w-[1280px] ml-auto mr-auto max-[1150px]:w-[calc(100%_-_80px)] max-[900px]:w-[calc(100%_-_56px)] max-[760px]:w-[calc(100%_-_40px)] max-[370px]:w-[calc(100%_-_32px)]"}>
        <div className={ui.heading} ref={headingRef} data-reveal>
          <div>
            <p className={ui.eyebrow}><span aria-hidden="true" /> DGS ON INSTAGRAM</p>
            <div className={ui.title}>
              <h2 id="reels-heading">Campus life,<br /><em>in motion.</em></h2>
              <svg className={ui.underline} viewBox="0 0 240 24" preserveAspectRatio="none" aria-hidden="true"><path data-draw pathLength={1} d="M4 15c22-7 40-9 58-4s32 7 52 1 36-10 58-5 30 7 64 0" /></svg>
              <svg className={ui.star} viewBox="0 0 24 24" aria-hidden="true"><path data-draw pathLength={1} d="M12 2.5l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.8l-5.8 3.5 1.6-6.6-5.2-4.4 6.8-.5z" /></svg>
            </div>
          </div>
          <div className={ui.aside}>
            <p lang={copy ? "hi" : undefined} className={ui.description}>{copy ? copy.reels : "Classroom moments, celebrations and student milestones—short reels straight from our Instagram."}</p>
            <a className={ui.follow} href={profile} target="_blank" rel="noopener noreferrer"><Instagram size={18} aria-hidden="true" /> @thedoonglobal_school <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>

        <div className={ui.board} ref={boardRef}>
          <p className={ui.hint} aria-hidden="true">
            <span className="[@media(hover:none)]:hidden">hover to play, click for sound</span>
            <span className="hidden [@media(hover:none)]:inline">tap a reel for sound</span>
            <svg viewBox="0 0 60 52"><path data-draw pathLength={1} d="M6 8c22-2 40 10 44 36" /><path data-draw pathLength={1} d="M40 34l10 11 8-13" /></svg>
          </p>
          <div className={ui.wall} ref={wallRef}>
            {reels.map((reel, index) => {
              const place = layout[index % layout.length];
              const style = { "--tilt": `${place.tilt}deg`, "--drop": `${place.drop}px`, "--tape": place.tape, "--tape-tilt": `${place.tapeTilt}deg` } as React.CSSProperties;
              return reel ? (
                <article className={ui.polaroid} key={reel.link} style={style} data-audible={audible === index} onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(index); }} onPointerLeave={() => setHovered(current => current === index ? null : current)}>
                  <span className={ui.tape} aria-hidden="true" />
                  <div className={ui.photo}>
                    {reel.video ? (
                      <ReelVideo reel={reel} video={reel.video} active={hovered === index} audible={audible === index} onSound={on => setAudible(on ? index : null)} />
                    ) : (
                      <a className={ui.watch} href={reel.link} target="_blank" rel="noopener noreferrer" aria-label={`Watch on Instagram: ${reel.title}`}>
                        <Image src={reel.cover} alt="" fill sizes="(max-width: 760px) 68vw, 272px" className="-z-1" />
                        <span className={ui.play} aria-hidden="true"><Play size={22} /></span>
                        <span aria-hidden="true"><Instagram size={15} /> Watch on Instagram</span>
                      </a>
                    )}
                  </div>
                  <div className={ui.note}>
                    <h3>{reel.title}</h3>
                    <a href={reel.link} target="_blank" rel="noopener noreferrer">#{reel.tag} <Instagram size={13} aria-hidden="true" /><span className="sr-only">: open “{reel.title}” on Instagram</span></a>
                  </div>
                </article>
              ) : (
                <div className={ui.polaroid} key={`empty-${index}`} style={style} aria-hidden="true">
                  <span className={ui.tape} />
                  <div className={ui.empty}><span><Instagram size={22} strokeWidth={1.4} /></span></div>
                  <div className={ui.note}><h3>coming soon…</h3></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
