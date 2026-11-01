"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";

// Static Tailwind utility groups keep the markup and responsive states readable.
const ui: Record<string, string> = {
  section: "dgs-partners-section-section bg-[#042d24] text-[#fffdf3] [border-block:7px_solid_var(--color-ivory)] scroll-mt-6 max-[600px]:[border-block-width:5px]",
  visual: "dgs-partners-section-visual relative overflow-hidden",
  backdrop: "dgs-partners-section-backdrop object-cover [object-position:center] max-[600px]:h-[365px]! max-[600px]:[object-position:86%_center]",
  shade: "dgs-partners-section-shade absolute top-0 right-0 bottom-0 left-0 [background:linear-gradient(90deg,_#012a20b3_0%,_#012a2066_35%,_#012a2029_60%,_transparent_78%)] max-[900px]:[background:linear-gradient(90deg,_#012a20bd,_#012a2077_60%,_#012a201a)] max-[600px]:[background:linear-gradient(0deg,_#042d24_48%,_transparent_68%),_linear-gradient(90deg,_#012a20e8,_#012a2099_48%,_#012a2012)]",
  content: "dgs-partners-section-content relative grid grid-cols-[35%_34%_31%] items-center min-h-[490px] pt-9.5 pb-9.5 min-[1700px]:min-h-[540px] max-[1150px]:grid-cols-[35%_38%_27%] max-[1150px]:min-h-[435px] max-[900px]:grid-cols-[42%_42%_16%] max-[900px]:min-h-[410px] max-[900px]:pt-8.5 max-[900px]:pb-8.5 max-[600px]:block max-[600px]:min-h-0 max-[600px]:pt-[35px] max-[600px]:pb-[31px]",
  copy: "dgs-partners-section-copy relative z-1 [&_h2]:text-[clamp(48px,_5vw,_73px)] [&_h2]:leading-[.99] [&_h2]:tracking-[-2.2px] max-[1150px]:[&_h2]:text-[58px] max-[900px]:[&_h2]:text-[53px] max-[600px]:min-h-[300px] max-[600px]:[&_h2]:text-[52px] max-[600px]:[&_h2]:leading-[1] max-[600px]:[&_h2]:tracking-[-1.5px] max-[370px]:[&_h2]:text-[47px]",
  eyebrow: "dgs-partners-section-eyebrow flex items-center gap-[9px] mb-4.5 text-[13px] leading-[1.6] font-semibold tracking-[1.55px] text-[#f4f1df] [&_>_span]:text-[23px] [&_>_span]:leading-[1] [&_>_span]:text-[#edbe66] max-[1150px]:text-[11px] max-[1150px]:tracking-[1.1px] max-[900px]:max-w-[250px] max-[900px]:text-[11px] max-[600px]:mb-[17px] max-[600px]:text-[11px] max-[600px]:max-w-none max-[370px]:text-[11px] max-[370px]:tracking-[.9px]",
  description: "dgs-partners-section-description mt-5 text-[17px] leading-[1.75] text-[#f0f1e6] max-[1150px]:text-[15px] max-[1150px]:max-w-[285px] max-[600px]:text-[15px] max-[600px]:max-w-[250px] max-[600px]:mt-[17px]",
  hint: "dgs-partners-section-hint mt-[25px] flex items-center gap-2.5 text-[13px] tracking-[.6px] text-[#e4c789] [&_svg]:opacity-85 max-[600px]:text-[12px] max-[600px]:mt-[17px]",
  network: "dgs-partners-section-network relative size-[370px] justify-self-center max-[1150px]:[zoom:.86] max-[900px]:[zoom:.76] max-[600px]:mx-auto max-[600px]:mt-[15px] max-[600px]:[zoom:.85] max-[370px]:[zoom:.79]",
  stage: "group/orbit relative size-[370px]",
  orbit: "pointer-events-none absolute left-[50px] top-[50px] size-[270px] rounded-full border border-[#d5b04f99] shadow-[0_0_24px_#d9b6550a]",
  schoolBadge: "dgs-partners-section-schoolBadge absolute left-1/2 top-1/2 z-2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#c7b36e] bg-[radial-gradient(circle_at_35%_25%,#164c34,#053c2c_65%)] shadow-[0_0_28px_#c4b34726,inset_0_0_22px_#0b2c2399] [&_img]:h-[72px] [&_img]:w-[92px] [&_img]:object-contain",
  partners: "dgs-partners-section-partners pointer-events-none absolute inset-0 z-3 origin-center",
  badge: "dgs-partners-section-badge pointer-events-auto flex size-full flex-col items-center justify-center gap-1 rounded-full border-2 border-[#fffefb] bg-[#fffefb] px-2 pt-3 pb-2 shadow-[0_4px_20px_#001b2230] transition-[box-shadow,border-color] duration-200 hover:border-gold hover:shadow-[0_0_0_5px_#edbe6622,0_10px_30px_#001a2866] aria-selected:border-gold aria-selected:shadow-[0_0_0_5px_#edbe6622,0_10px_30px_#001a2866] focus-visible:outline-3 focus-visible:outline-[#f5d98d] focus-visible:outline-offset-[5px] [&_img]:h-12.5 [&_img]:w-18.5 [&_img]:object-contain [&_span]:text-[9.5px] [&_span]:font-[650] [&_span]:leading-[1.3] [&_span]:tracking-[0] [&_span]:whitespace-nowrap [&_span]:text-[#3a473b] motion-reduce:transition-none",
  goalkeepers: "[&_img]:h-10 [&_img]:w-[79px]",
  bengaluru: "[&_img]:h-[58px]! [&_img]:w-16! [&_span]:hidden",
  prayaas: "[&_img]:h-10 [&_img]:w-[79px] [&_span]:hidden",
  kidnasium: "[&_img]:h-[51px] [&_img]:w-14",
  note: "dgs-partners-section-note self-start justify-self-start mt-7 mr-0 mb-0 ml-4.5 font-serif italic text-[28px] leading-[1.25] tracking-[-.3px] [transform:rotate(-10deg)] [text-shadow:0_2px_15px_#001b16cc] max-[1150px]:text-[23px] max-[1150px]:mt-5.5 max-[1150px]:mr-0 max-[1150px]:mb-0 max-[1150px]:ml-2.5 max-[900px]:hidden",
  details: "dgs-partners-section-details [border-top:1px_solid_#bba86a44] bg-[#052f27] [&[hidden]]:hidden [&_h3]:mt-[7px] [&_h3]:font-serif [&_h3]:text-[26px] [&_h3]:leading-[1.2] [&_p]:text-[16px] [&_p]:text-[#e0e7d9] [&_small]:block [&_small]:mt-2 [&_small]:text-[13px] [&_small]:leading-[1.6] [&_small]:text-[#b1c0a9] [&_a]:w-10 [&_a]:h-10 [&_a]:grid [&_a]:place-items-center [&_a]:[border:1px_solid_#d6b87788] [&_a]:rounded-full [&_a]:text-[#edcf90] [&_a:hover]:bg-[#edbe6620] max-[900px]:[&_h3]:text-[23px] max-[900px]:[&_p]:text-[15px] max-[600px]:[&_h3]:text-[24px] max-[600px]:[&_h3]:pr-[13px] max-[600px]:[&_a]:row-[1] max-[600px]:[&_a]:col-[2] max-[600px]:[&_a]:w-8.5 max-[600px]:[&_a]:h-8.5 max-[600px]:[&_a]:mr-2",
  detailsInner: "dgs-partners-section-detailsInner relative grid grid-cols-[.9fr_1.3fr_auto] gap-10 items-center pt-[27px] pb-[27px] pr-[35px] max-[900px]:gap-[23px] max-[600px]:grid-cols-[1fr_auto] max-[600px]:gap-[15px] max-[600px]:pt-[25px] max-[600px]:pb-[25px] max-[600px]:pr-0 max-[600px]:[&_>_div:nth-child(2)]:row-[2] max-[600px]:[&_>_div:nth-child(2)]:col-[1_/_-1]",
  detailEyebrow: "dgs-partners-section-detailEyebrow text-[12px] font-semibold tracking-[1.4px] uppercase text-[#d6b877]",
  close: "dgs-partners-section-close absolute top-[13px] -right-1 [border:none] bg-transparent text-[#cad7be] pt-[7px] pr-[7px] pb-[7px] pl-[7px] max-[600px]:top-1 max-[600px]:right-[-9px]",
  desktopBreak: "dgs-partners-section-desktopBreak max-[1150px]:hidden",
};

// The track and each badge share the same clock; reverse rotation keeps logos upright.
const rotationClasses = "motion-safe:animate-spin motion-safe:[animation-duration:40s] group-data-[animated=false]/orbit:animate-none group-data-[paused=true]/orbit:[animation-play-state:paused] group-hover/orbit:[animation-play-state:paused] group-focus-within/orbit:[animation-play-state:paused] motion-reduce:animate-none";
// Four equally spaced points on a 135px radius around (185, 185), with 96px badges.
const orbitPositions = [
  "left-[137px] top-[2px]",
  "left-[272px] top-[137px]",
  "left-[137px] top-[272px]",
  "left-[2px] top-[137px]",
];

const programmes = [
  { name: "Goalkeepers", image: "goalkeepers.webp", position: "goalkeepers", label: "A thoughtful first step", description: "DGS’s own pre-admission programme helps families understand a child’s strengths and next steps, beyond a score.", link: "https://doonglobalschool.edu.in/programmes/" },
  { name: "BFC Soccer Schools", image: "bfc-soccer-schools-stacked.webp", position: "bengaluru", label: "Find your footballing feet", description: "A connection with Bengaluru FC Soccer Schools brings a dedicated football programme into the conversation.", link: "https://bfcsoccerschools.com/" },
  { name: "Prayaas", image: "prayaas.webp", position: "prayaas", label: "Clarity before the boards", description: "Independent CBSE mock-board assessments help senior students understand what to focus on next.", link: "https://prayaassessments.com/" },
  { name: "Kidnasium", image: "kidnasium.webp", position: "kidnasium", label: "The joy of moving", description: "Discover an approach to movement, fitness and physical confidence through the school’s Kidnasium association.", link: "https://kidnasium.in/" },
];

export default function PartnersSection() {
  const [active, setActive] = useState<number | null>(null);
  const [animationReady, setAnimationReady] = useState(false);
  const [inView, setInView] = useState(false);
  const networkRef = useRef<HTMLDivElement>(null);
  const selected = active === null ? null : programmes[active];

  useEffect(() => {
    const network = networkRef.current;
    if (!network) return;
    setAnimationReady(true);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .1 });
    observer.observe(network);
    return () => observer.disconnect();
  }, []);

  function closeDetails() {
    const previous = active;
    setActive(null);
    if (previous !== null) document.getElementById(`programme-tab-${previous}`)?.focus();
  }

  return (
    <section id="programmes" className={ui.section} aria-labelledby="partners-heading">
      <div className={ui.visual}>
        <Image
          className={ui.backdrop}
          src="/images/partners-football.png"
          alt="Illustrative school sports campaign: a boy practising football on a sunlit playing field"
          fill
          sizes="(max-width: 600px) 1100px, 100vw"
          quality={85}
        />
        <div className={ui.shade} />

        <div className={`dgs-container w-[calc(100%_-_128px)] max-w-[1280px] ml-auto mr-auto max-[1150px]:w-[calc(100%_-_80px)] max-[900px]:w-[calc(100%_-_56px)] max-[760px]:w-[calc(100%_-_40px)] max-[370px]:w-[calc(100%_-_32px)] ${ui.content}`}>
          <div className={ui.copy} data-reveal>
            <p className={ui.eyebrow}><span aria-hidden="true">⟶</span> OUR PARTNERS IN STUDENT GROWTH</p>
            <h2 id="partners-heading">Learning<br />Beyond<br />Classrooms.</h2>
            <p className={ui.description}>Organisations we work alongside to widen<br className={ui.desktopBreak} /> what students can do beyond the classroom.</p>
            <p className={ui.hint}>Discover our programmes <ArrowRight size={14} aria-hidden="true" /></p>
          </div>

          <div ref={networkRef} className={ui.network} data-reveal data-reveal-delay="1">
            <div className={ui.stage} data-animated={animationReady} data-paused={!inView}>
              <div className={ui.orbit} aria-hidden="true" />
              <div className={ui.schoolBadge}>
                <Image src="/images/logo-white.webp" alt="Doon Global School" width={106} height={78} />
              </div>

            <div className={`${ui.partners} ${rotationClasses}`} role="tablist" aria-label="School programmes">
              {programmes.map((programme, index) => (
                <div key={programme.name} className={`absolute size-24 ${orbitPositions[index]}`} role="presentation">
                  <div className={`size-full motion-safe:[animation-direction:reverse] ${rotationClasses}`} data-orbit-counter role="presentation">
                <button
                  id={`programme-tab-${index}`}
                  className={`${ui.badge} ${ui[programme.position]}`}
                  role="tab"
                  aria-label={programme.name}
                  aria-selected={active === index}
                  aria-controls="programme-panel"
                  tabIndex={(active ?? 0) === index ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={event => {
                    if (event.key === "Escape") { closeDetails(); return; }
                    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
                    event.preventDefault();
                    const next = event.key === "Home" ? 0 : event.key === "End" ? programmes.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + programmes.length) % programmes.length;
                    setActive(next);
                    document.getElementById(`programme-tab-${next}`)?.focus();
                  }}
                >
                  <Image src={`/images/${programme.image}`} alt="" width={90} height={65} />
                  <span>{programme.name.toUpperCase()}</span>
                </button>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>

          <p className={ui.note}>A stronger<br />tomorrow for<br />every young boy.</p>
        </div>
      </div>

      <div className={ui.details} id="programme-panel" role="tabpanel" aria-labelledby={active === null ? undefined : `programme-tab-${active}`} hidden={selected === null} tabIndex={0}>
        {selected && <div className={`dgs-container w-[calc(100%_-_128px)] max-w-[1280px] ml-auto mr-auto max-[1150px]:w-[calc(100%_-_80px)] max-[900px]:w-[calc(100%_-_56px)] max-[760px]:w-[calc(100%_-_40px)] max-[370px]:w-[calc(100%_-_32px)] ${ui.detailsInner}`}>
          <div><span className={ui.detailEyebrow}>{selected.name}</span><h3>{selected.label}</h3></div>
          <div><p>{selected.description}</p><small>Programme access and charges vary by class and session. Also ask about Skill-ed, DGS’s primary-years programme.</small></div>
          <a href={selected.link} target="_blank" rel="noopener noreferrer" aria-label={`Learn about ${selected.name} (opens in a new tab)`}><ArrowUpRight size={23} /></a>
          <button className={ui.close} onClick={closeDetails} aria-label="Close programme details"><X size={17} /></button>
        </div>}
      </div>
    </section>
  );
}
