"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";

// Static Tailwind utility groups keep the markup and responsive states readable.
const ui: Record<string, string> = {
  section: "dgs-school-life-section-section pt-15.5 pb-15.5 [background:radial-gradient(ellipse_at_0%_100%,_#ece9da88,_transparent_55%),_#f8f6ee] [border-block:1px_solid_#e8e5d8] max-[900px]:pt-11.5 max-[900px]:pb-11.5 max-[600px]:pt-[39px] max-[600px]:pb-10.5",
  layout: "dgs-school-life-section-layout grid grid-cols-[minmax(0,_.84fr)_minmax(0,_2.16fr)] items-center gap-12 max-[1150px]:grid-cols-[minmax(0,_.9fr)_minmax(0,_2.1fr)] max-[1150px]:gap-7.5 max-[900px]:grid-cols-[1fr] max-[900px]:gap-7.5 max-[600px]:gap-[27px]",
  intro: "dgs-school-life-section-intro pt-2 pb-2 [&_h2]:text-[clamp(36px,_3.5vw,_51px)] [&_h2]:leading-[1.04] [&_h2]:tracking-[-1.7px] [&_h2]:text-[#133d34] [&_h2_em]:not-italic max-[1150px]:[&_h2]:text-[39px] max-[900px]:grid max-[900px]:grid-cols-[1fr_1fr] max-[900px]:[align-items:start] max-[900px]:gap-x-7.5 max-[900px]:pt-0 max-[900px]:pr-0 max-[900px]:pb-0 max-[900px]:pl-0 max-[900px]:[&_h2]:row-[2_/_4] max-[900px]:[&_h2]:text-[43px] max-[600px]:block max-[600px]:[&_h2]:text-[42px] max-[600px]:[&_h2]:tracking-[-1.25px] max-[370px]:[&_h2]:text-[39px]",
  eyebrow: "dgs-school-life-section-eyebrow flex items-center gap-2 text-[9px] font-[650] leading-[1.5] tracking-[1.65px] text-[#53665a] mb-[17px] [&_>_span]:w-[17px] [&_>_span]:h-[1px] [&_>_span]:bg-[#486450] max-[900px]:col-[1_/_-1] max-[900px]:mb-[15px] max-[600px]:text-[8px] max-[600px]:tracking-[1.4px] max-[600px]:mb-[15px]",
  description: "dgs-school-life-section-description max-w-[290px] mt-5.5 text-[13px] leading-[1.75] text-[#546758] max-[1150px]:text-[12px] max-[1150px]:mt-4.5 max-[900px]:mt-0 max-[900px]:max-w-[290px] max-[600px]:max-w-[325px] max-[600px]:mt-4.5 max-[600px]:text-[12px]",
  explore: "dgs-school-life-section-explore inline-flex items-center justify-center gap-6 min-h-11.5 mt-6 pt-3 pr-[19px] pb-3 pl-[19px] [border:1px_solid_#18483a] rounded-[5px] bg-[#073c32] text-[#fffbee] text-[12px] font-[550] [transition:background_.25s_ease] [&_>_svg]:text-[#e8d2a0] [&_>_svg]:[transition:transform_.25s_ease] [&:hover]:bg-[#19533f] [&:hover_>_svg]:[transform:translateX(3px)] max-[1150px]:text-[11px] max-[1150px]:pl-[15px] max-[1150px]:pr-[15px] max-[1150px]:gap-[17px] max-[1150px]:mt-5 max-[900px]:justify-self-start max-[900px]:self-end max-[900px]:mt-[19px] max-[600px]:min-h-11 max-[600px]:mt-5 max-[600px]:pl-[17px] max-[600px]:pr-[17px] max-[600px]:gap-[25px] motion-reduce:transition-none motion-reduce:[&_>_svg]:transition-none motion-reduce:[&:hover_>_svg]:[transform:none]",
  gallery: "dgs-school-life-section-gallery min-w-0",
  grid: "dgs-school-life-section-grid grid grid-cols-[repeat(3,_minmax(0,_1fr))] gap-3 max-[1150px]:gap-2.5 max-[600px]:grid-cols-[repeat(2,_minmax(0,_1fr))] max-[600px]:gap-[11px] max-[370px]:gap-[9px]",
  card: "dgs-school-life-section-card min-w-0 mt-0 mr-0 mb-0 ml-0 font-serif font-normal",
  cardButton: "dgs-school-life-section-cardButton block w-full pt-0 pr-0 pb-0 pl-0 [border:1px_solid_#0e463425] rounded-[7px] bg-[#073c32] text-left shadow-[0_3px_12px_#193e2310] [transition:box-shadow_.3s_ease] [&:hover]:shadow-[0_7px_20px_#193e2320] [&:hover_.dgs-school-life-section-photo_>_img]:[transform:scale(1.035)] [&[aria-expanded=true]]:[outline:2px_solid_#b5995f] [&[aria-expanded=true]]:outline-offset-[3px] [&[aria-expanded=true]_.dgs-school-life-section-caption_>_svg]:[transform:rotate(45deg)] motion-reduce:transition-none motion-reduce:[&:hover_.dgs-school-life-section-photo_>_img]:[transform:none]",
  photo: "dgs-school-life-section-photo block relative [aspect-ratio:3_/_2] overflow-hidden rounded-[6px_6px_0_0] [&_>_img]:object-cover [&_>_img]:[transition:transform_.55s_cubic-bezier(.22,_1,_.36,_1)] motion-reduce:[&_>_img]:transition-none",
  caption: "dgs-school-life-section-caption relative flex items-center justify-between gap-2 min-h-[39px] pt-[7px] pr-[13px] pb-2 pl-[13px] rounded-[0_0_6px_6px] bg-[#073c32] text-[#fffbee] font-serif text-[20px] leading-[1.2] tracking-[-.25px] [&_>_svg]:flex-none [&_>_svg]:text-[#d6c493] [&_>_svg]:stroke-[1.3] [&_>_svg]:[transition:transform_.3s_ease] max-[1150px]:text-[17px] max-[1150px]:pl-2.5 max-[1150px]:pr-2.5 max-[1150px]:min-h-9 max-[900px]:text-[19px] max-[600px]:min-h-8.5 max-[600px]:pt-[7px] max-[600px]:pr-[9px] max-[600px]:pb-[7px] max-[600px]:pl-[9px] max-[600px]:text-[16px] max-[600px]:[&_>_svg]:w-[13px] max-[600px]:[&_>_svg]:h-[13px] max-[370px]:text-[15px] motion-reduce:[&_>_svg]:transition-none",
  details: "dgs-school-life-section-details mt-4.5 pt-[21px] pr-6 pb-[21px] pl-6 [border:1px_solid_#dfdece] [border-left:2px_solid_#b5995f] rounded-[4px] bg-[#fffdf6] [&[hidden]]:hidden [&_h3]:mt-[7px] [&_h3]:font-serif [&_h3]:text-[25px] [&_h3]:leading-[1.2] [&_h3_+_p]:mt-2.5 [&_h3_+_p]:max-w-[650px] [&_h3_+_p]:text-[#596a5d] [&_h3_+_p]:text-[12px] [&_h3_+_p]:leading-[1.8] [&_>_a]:inline-flex [&_>_a]:items-center [&_>_a]:gap-[9px] [&_>_a]:mt-[13px] [&_>_a]:text-[10px] [&_>_a]:font-semibold [&_>_a]:[border-bottom:1px_solid_#899b7160] [&_>_a]:pb-1 max-[600px]:pt-4.5 max-[600px]:pr-4.5 max-[600px]:pb-4.5 max-[600px]:pl-4.5 max-[600px]:[&_h3]:text-[23px] max-[600px]:[&_h3_+_p]:text-[11px]",
  detailLabel: "dgs-school-life-section-detailLabel text-[#7b815b] text-[9px] font-semibold tracking-[1.2px] uppercase",
};


const activities = [
  {
    id: "academics",
    title: "Academics",
    alt: "Illustrative North East Indian student studying in a sunlit school library",
    heading: "Curiosity today. Confidence tomorrow.",
    description: "A strong CBSE foundation, with space to ask questions, discover new ideas and develop independent study habits.",
  },
  {
    id: "sports",
    title: "Sports",
    alt: "Illustrative North East Indian student practising football on a school field",
    heading: "Find your game. Find your team.",
    description: "From football and cricket to basketball and athletics, sport brings opportunities to practise, work together and keep growing.",
  },
  {
    id: "creativity",
    title: "Creativity",
    alt: "Illustrative North East Indian student building an educational robot",
    heading: "Big ideas begin with a little curiosity.",
    description: "Robotics, hands-on exploration and creative expression give young minds room to experiment, make and discover.",
  },
  {
    id: "leadership",
    title: "Leadership",
    alt: "Illustrative North East Indian student in a school cadet uniform",
    heading: "Small steps towards stronger selves.",
    description: "House activities, teamwork, service and opportunities including NCC and NSS help students practise responsibility and leadership.",
  },
  {
    id: "life-skills",
    title: "Life Skills",
    alt: "Illustrative North East Indian student playing an acoustic guitar at school",
    heading: "Confidence beyond the classroom.",
    description: "Music, shared activities and everyday school routines encourage self-expression, patience, collaboration and growing independence.",
  },
  {
    id: "boarding",
    title: "Boarding Life",
    alt: "Illustrative North East Indian students sharing a friendly moment in a boarding common room",
    heading: "New friendships. A sense of belonging.",
    description: "A residential experience for boys in Classes 3–12, with time for study, shared routines, friendship and the everyday discoveries of growing up.",
  },
];

export default function SchoolLifeSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activities.find(activity => activity.id === activeId);

  return (
    <section className={ui.section} id="life-at-dgs" aria-labelledby="school-life-heading">
      <div className={`dgs-container w-[calc(100%_-_128px)] max-w-[1280px] ml-auto mr-auto max-[1150px]:w-[calc(100%_-_80px)] max-[900px]:w-[calc(100%_-_56px)] max-[760px]:w-[calc(100%_-_40px)] max-[370px]:w-[calc(100%_-_32px)] ${ui.layout}`}>
        <div className={ui.intro} data-reveal>
          <p className={ui.eyebrow}><span aria-hidden="true" /> LIFE AT DGS</p>
          <h2 id="school-life-heading">A School Day<br />with Room<br />for <em>More.</em></h2>
          <p className={ui.description}>At DGS, academics and a vibrant environment come together to help students grow with confidence.</p>
          <a className={ui.explore} href="#programmes">Explore Life at DGS <ArrowRight size={17} aria-hidden="true" /></a>
        </div>

        <div className={ui.gallery}>
          <div className={ui.grid}>
            {activities.map((activity, index) => (
              <h3 className={ui.card} key={activity.id} data-reveal data-reveal-delay={index % 3}>
                <button
                  className={ui.cardButton}
                  type="button"
                  aria-label={`Explore ${activity.title}`}
                  aria-expanded={activeId === activity.id}
                  aria-controls="school-life-details"
                  onClick={() => setActiveId(activeId === activity.id ? null : activity.id)}
                >
                  <span className={ui.photo}>
                    <Image src={`/images/life-at-dgs/${activity.id}.webp`} alt={activity.alt} fill sizes="(max-width: 600px) 46vw, (max-width: 900px) 30vw, (max-width: 1440px) 23vw, 300px" />
                  </span>
                  <span className={ui.caption}>{activity.title}<Plus size={16} aria-hidden="true" /></span>
                </button>
              </h3>
            ))}
          </div>
          <div id="school-life-details" className={ui.details} hidden={!active}>
            {active && <>
              <p className={ui.detailLabel}>{active.title}</p>
              <h3>{active.heading}</h3>
              <p>{active.description}</p>
              <a href="#faqs">Admission questions <ArrowRight size={14} aria-hidden="true" /></a>
            </>}
          </div>
        </div>
      </div>
    </section>
  );
}
