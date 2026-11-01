"use client";

import { uttarakhandCopy as uk } from "@/lib/uttarakhand-copy";

import Image from "next/image";
import { useCampaign } from "@/components/campaign-context";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

// Static Tailwind utility groups keep the markup and responsive states readable.
// Cards rest in a loose, tilted collage (`--rest-y` staggers the columns); scripts fly them in from scattered positions as the page scrolls.
const ui: Record<string, string> = {
  section: "dgs-school-life-section-section relative overflow-clip pt-20 pb-28 [background:radial-gradient(ellipse_at_0%_100%,_#ece9da88,_transparent_55%),_#f8f6ee] [border-block:1px_solid_#e8e5d8] max-[900px]:pt-16 max-[900px]:pb-24 max-[600px]:pt-12 max-[600px]:pb-16",
  heading: "dgs-school-life-section-heading flex justify-between items-end gap-12 mb-14 [&_h2]:text-[clamp(38px,_3.7vw,_54px)] [&_h2]:leading-[1.04] [&_h2]:tracking-[-1.7px] [&_h2]:text-[#133d34] [&_h2_em]:text-[#687552] max-[900px]:block max-[900px]:mb-10 max-[600px]:mb-8 max-[600px]:[&_h2]:text-[38px] max-[600px]:[&_h2]:tracking-[-1.2px]",
  eyebrow: "dgs-school-life-section-eyebrow flex items-center gap-2 text-[13px] font-[650] leading-[1.5] tracking-[1.65px] text-[#53665a] mb-[17px] [&_>_span]:w-[17px] [&_>_span]:h-[1px] [&_>_span]:bg-[#486450] max-[600px]:text-[12px] max-[600px]:tracking-[1.4px] max-[600px]:mb-[15px]",
  aside: "dgs-school-life-section-aside max-w-[400px] pb-1 max-[900px]:max-w-[560px] max-[900px]:mt-5",
  description: "dgs-school-life-section-description text-[16px] leading-[1.75] text-[#546758] max-[600px]:text-[15px]",
  explore: "dgs-school-life-section-explore inline-flex items-center justify-center gap-6 min-h-11.5 mt-6 pt-3 pr-[19px] pb-3 pl-[19px] [border:1px_solid_#18483a] rounded-[5px] bg-[#073c32] text-[#fffbee] text-[15px] font-[550] [transition:background_.25s_ease] [&_>_svg]:text-[#e8d2a0] [&_>_svg]:[transition:transform_.25s_ease] [&:hover]:bg-[#19533f] [&:hover_>_svg]:[transform:translateX(3px)] max-[600px]:mt-5 motion-reduce:transition-none motion-reduce:[&_>_svg]:transition-none",
  collage: "dgs-school-life-section-collage relative grid grid-cols-[repeat(3,_minmax(0,_1fr))] gap-x-12 gap-y-14 items-start min-[901px]:[&_>_*:nth-child(3n+2)]:[--rest-y:96px] min-[901px]:[&_>_*:nth-child(3n+3)]:[--rest-y:40px] max-[1150px]:gap-x-8 max-[900px]:grid-cols-[repeat(2,_minmax(0,_1fr))] max-[900px]:gap-x-7 max-[900px]:gap-y-12 min-[601px]:max-[900px]:[&_>_*:nth-child(2n)]:[--rest-y:72px] max-[600px]:grid-cols-[1fr] max-[600px]:gap-y-9 max-[600px]:[&_>_*]:w-[90%] max-[600px]:[&_>_*:nth-child(2n)]:justify-self-end",
  card: "dgs-school-life-section-card group relative pt-3 pr-3 pb-4 pl-3 [border:1px_solid_#e4e0d1] rounded-[6px] bg-[#fffdf6] shadow-[0_22px_50px_#173a271c] [translate:0_var(--rest-y,0px)] [rotate:var(--rest-r,0deg)] [transition:box-shadow_.35s_ease] [&:hover]:shadow-[0_28px_60px_#173a272b] will-change-transform motion-reduce:transition-none",
  photo: "dgs-school-life-section-photo relative block overflow-hidden rounded-[3px] bg-[#073c32] [&_>_img]:object-cover [&_>_img]:[transition:scale_.8s_cubic-bezier(.16,_1,_.3,_1)] [&:hover_>_img]:scale-[1.05] motion-reduce:[&_>_img]:transition-none",
  text: "dgs-school-life-section-text pt-4 pr-1.5 pl-1.5 [&_h3]:mt-1.5 [&_h3]:font-serif [&_h3]:text-[23px] [&_h3]:leading-[1.15] [&_h3]:tracking-[-.3px] [&_h3]:text-[#133d34] [&_p:last-child]:mt-2 [&_p:last-child]:text-[15px] [&_p:last-child]:leading-[1.65] [&_p:last-child]:text-[#546758] max-[600px]:[&_h3]:text-[21px] max-[600px]:[&_p:last-child]:text-[14px]",
  label: "dgs-school-life-section-label text-[#666b4b] text-[12px] font-semibold tracking-[1.4px] uppercase",
};


const activities = [
  {
    id: "academics",
    title: "Academics",
    src: "/images/life-at-dgs/campus-academics.webp",
    position: "55% center",
    alt: "Doon Global School students examining specimens together in the science lab",
    heading: "Curiosity today. Confidence tomorrow.",
    description: "A strong CBSE foundation, with space to ask questions, discover new ideas and develop independent study habits.",
  },
  {
    id: "sports",
    title: "Sports",
    src: "/images/life-at-dgs/campus-sports.webp",
    position: "center",
    alt: "Doon Global School football team standing together on the playing field",
    heading: "Find your game. Find your team.",
    description: "From football and cricket to basketball and athletics, sport brings opportunities to practise, work together and keep growing.",
  },
  {
    id: "creativity",
    title: "Creativity",
    src: "/images/life-at-dgs/campus-creativity.webp",
    position: "60% center",
    alt: "Doon Global School students building a wheeled model in a robotics activity",
    heading: "Big ideas begin with a little curiosity.",
    description: "Robotics, hands-on exploration and creative expression give young minds room to experiment, make and discover.",
  },
  {
    id: "leadership",
    title: "Leadership",
    src: "/images/life-at-dgs/campus-leadership.webp",
    position: "center",
    alt: "Doon Global School students marching together behind their house flag",
    heading: "Small steps towards stronger selves.",
    description: "House activities, teamwork, service and opportunities including NCC and NSS help students practise responsibility and leadership.",
  },
  {
    id: "life-skills",
    title: "Life Skills",
    src: "/images/life-at-dgs/campus-life-skills.webp",
    position: "center",
    alt: "Doon Global School students singing and playing guitars, keyboard and drums",
    heading: "Confidence beyond the classroom.",
    description: "Music, shared activities and everyday school routines encourage self-expression, patience, collaboration and growing independence.",
  },
  {
    id: "boarding",
    title: "Boarding Life",
    src: "/images/life-at-dgs/campus-boarding.webp",
    position: "65% center",
    alt: "Doon Global School student working in a notebook during study time",
    heading: "New friendships. A sense of belonging.",
    description: "A residential experience for boys in Classes 3–12, with time for study, shared routines, friendship and the everyday discoveries of growing up.",
  },
] as const;

// Resting tilt, photo shape and the scattered point each card flies in from (x and y as fractions of the viewport).
const layout = [
  { rest: -2.4, aspect: "4 / 3", from: { x: -.46, y: .16, r: -18 } },
  { rest: 1.8, aspect: "3 / 2", from: { x: .1, y: .3, r: 14 } },
  { rest: -1.2, aspect: "4 / 3", from: { x: .5, y: .14, r: 17 } },
  { rest: 2.1, aspect: "3 / 2", from: { x: -.5, y: .12, r: 15 } },
  { rest: -1.9, aspect: "3 / 2", from: { x: -.12, y: .26, r: -13 } },
  { rest: 1.4, aspect: "4 / 3", from: { x: .52, y: .14, r: -16 } },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - (1 - value) ** 2;

export default function SchoolLifeSection() {
  const isUttarakhand = useCampaign().id === "uttarakhand";
  const campaignActivities = isUttarakhand ? activities.map(activity => ({ ...activity, ...uk.photoCards[activity.id] })) : activities;
  const collageRef = useRef<HTMLDivElement>(null);

  // Each card's own position drives it: it scatters in from off to the side, settles into the collage, then drifts gently.
  useEffect(() => {
    const collage = collageRef.current;
    if (!collage) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(collage.querySelectorAll<HTMLElement>("article"));
    let frame = 0;
    function update() {
      frame = 0;
      if (!collage) return;
      if (motion.matches) {
        for (const card of cards) { card.style.transform = ""; card.style.opacity = ""; }
        return;
      }
      const viewport = window.innerHeight;
      const width = window.innerWidth;
      const top = collage.getBoundingClientRect().top;
      const columns = getComputedStyle(collage).gridTemplateColumns.split(" ").length;
      cards.forEach((card, index) => {
        const { from } = layout[index];
        const cardTop = top + card.offsetTop;
        const progress = easeOut(clamp((viewport * .96 - cardTop) / (viewport * .6)));
        const scatter = 1 - progress;
        const spread = Math.min(width, 1440);
        const drift = columns > 1 ? (cardTop + card.offsetHeight / 2 - viewport / 2) * [0, -.07, .045][index % 3] : 0;
        card.style.transform = `translate3d(${(from.x * spread * scatter).toFixed(1)}px, ${(from.y * viewport * scatter + drift).toFixed(1)}px, 0) rotate(${(from.r * scatter).toFixed(2)}deg) scale(${(1 - .16 * scatter).toFixed(3)})`;
        card.style.opacity = clamp(progress * 1.8).toFixed(3);
      });
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section className={ui.section} id="life-at-dgs" aria-labelledby="school-life-heading">
      <div className={"dgs-container w-[calc(100%_-_128px)] max-w-[1280px] ml-auto mr-auto max-[1150px]:w-[calc(100%_-_80px)] max-[900px]:w-[calc(100%_-_56px)] max-[760px]:w-[calc(100%_-_40px)] max-[370px]:w-[calc(100%_-_32px)]"}>
        <div className={ui.heading} data-reveal>
          <div>
            <p className={ui.eyebrow}><span aria-hidden="true" /> LIFE AT DGS</p>
            <h2 id="school-life-heading">A School Day<br />with Room for <em>More.</em></h2>
          </div>
          <div className={ui.aside}>
            <p lang={isUttarakhand ? "hi" : undefined} className={ui.description}>{isUttarakhand ? uk.schoolLife : "At DGS, academics and a vibrant environment come together to help students grow with confidence."}</p>
            <a className={ui.explore} href="#programmes">Explore Life at DGS <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </div>

        <div className={ui.collage} ref={collageRef}>
          {campaignActivities.map((activity, index) => (
            <article className={ui.card} key={activity.id} style={{ "--rest-r": `${layout[index].rest}deg` } as React.CSSProperties}>
              <span className={ui.photo} style={{ aspectRatio: layout[index].aspect }}>
                <Image src={activity.src} alt={activity.alt} lang={isUttarakhand ? "hi" : undefined} fill sizes="(max-width: 600px) 82vw, (max-width: 900px) 44vw, 400px" style={{ objectPosition: activity.position }} />
              </span>
              <div className={ui.text}>
                <p className={ui.label}>{String(index + 1).padStart(2, "0")} — {activity.title}</p>
                <h3>{activity.heading}</h3>
                <p lang={isUttarakhand ? "hi" : undefined}>{activity.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
