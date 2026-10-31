import Image from "next/image";
import { ArrowUpRight, Compass, GraduationCap, House, MapPin, Users } from "lucide-react";
import { ADMISSION_CITY_LABEL } from "@/lib/enquiry";

// Static Tailwind utility groups keep the markup and responsive states readable.
const ui: Record<string, string> = {
  section: "dgs-north-east-benefits-section pt-19 pb-19 bg-[#f3f2e9] text-[#163f33] max-[1100px]:pt-15 max-[1100px]:pb-15 max-[600px]:pt-10.5 max-[600px]:pb-10.5",
  heading: "dgs-north-east-benefits-heading flex justify-between items-end gap-12.5 mb-8.5 [&_h2]:text-[clamp(39px,_3.7vw,_54px)] [&_h2]:leading-[1.04] [&_h2]:tracking-[-1.7px] [&_h2_em]:text-[#687552] max-[1100px]:gap-[35px] max-[1100px]:[&_h2]:text-[44px] max-[800px]:block max-[600px]:mb-[25px] max-[600px]:[&_h2]:text-[40px] max-[600px]:[&_h2]:tracking-[-1.3px]",
  eyebrow: "dgs-north-east-benefits-eyebrow flex items-center gap-[9px] mb-4.5 text-[#5c6d53] text-[12px] leading-[1.7] font-semibold tracking-[1.6px] [&_>_span]:w-[21px] [&_>_span]:h-[1px] [&_>_span]:flex-none [&_>_span]:bg-[#a68b53] max-[600px]:text-[11px] max-[600px]:tracking-[1.05px] max-[600px]:gap-[7px] max-[600px]:mb-4 max-[600px]:[&_>_span]:w-[15px]",
  introduction: "dgs-north-east-benefits-introduction max-w-[370px] pb-1 text-[#5e6b5a] text-[17px] leading-[1.85] max-[1100px]:max-w-[315px] max-[1100px]:text-[16px] max-[800px]:max-w-[530px] max-[800px]:mt-[21px] max-[800px]:pt-0 max-[800px]:pr-0 max-[800px]:pb-0 max-[800px]:pl-0 max-[600px]:text-[16px] max-[600px]:mt-4.5",
  content: "dgs-north-east-benefits-content grid grid-cols-[minmax(0,_.88fr)_minmax(0,_1.12fr)] gap-10 items-stretch max-[1100px]:grid-cols-[minmax(0,_.85fr)_minmax(0,_1.15fr)] max-[1100px]:gap-7 max-[800px]:grid-cols-[1fr] max-[800px]:gap-[27px]",
  visual: "dgs-north-east-benefits-visual relative min-h-[382px] mt-0 mr-0 mb-0 ml-0 overflow-hidden rounded-[7px] bg-[#244937] [&_>_img]:object-cover [&_>_img]:[object-position:50%_36%] [&_>_img]:[transition:transform_.8s_cubic-bezier(.16,_1,_.3,_1)] [&::after]:content-[''] [&::after]:absolute [&::after]:top-[35%] [&::after]:right-0 [&::after]:bottom-0 [&::after]:left-0 [&::after]:[background:linear-gradient(transparent,_#052d26e8)] [&::after]:pointer-events-none [&_figcaption]:absolute [&_figcaption]:z-1 [&_figcaption]:bottom-6.5 [&_figcaption]:left-[27px] [&_figcaption]:right-6 [&_figcaption]:text-[#fffbed] [&_figcaption_>_span]:block [&_figcaption_>_span]:mb-[11px] [&_figcaption_>_span]:text-[#e1d4af] [&_figcaption_>_span]:text-[11px] [&_figcaption_>_span]:font-medium [&_figcaption_>_span]:tracking-[1.9px] [&_figcaption_p]:font-serif [&_figcaption_p]:text-[36px] [&_figcaption_p]:leading-[1.04] [&_figcaption_p]:tracking-[-.9px] [&_figcaption_em]:text-[#edd6a4] max-[1100px]:[&_figcaption_p]:text-[31px] max-[1100px]:[&_figcaption]:left-5.5 max-[1100px]:[&_figcaption]:bottom-[23px] max-[800px]:min-h-0 max-[800px]:[aspect-ratio:1.7] max-[800px]:[&_>_img]:[object-position:center_37%] max-[600px]:[aspect-ratio:1.25] max-[600px]:[&_figcaption]:left-[19px] max-[600px]:[&_figcaption]:bottom-[21px] max-[600px]:[&_figcaption_>_span]:text-[11px] max-[600px]:[&_figcaption_>_span]:tracking-[1.6px] max-[600px]:[&_figcaption_>_span]:mb-[9px] max-[600px]:[&_figcaption_p]:text-[29px] motion-reduce:[&_>_img]:transition-none [@media(hover:hover)]:motion-safe:[&:hover_>_img]:[transform:scale(1.035)]",
  location: "dgs-north-east-benefits-location absolute z-1 left-[21px] top-[21px] inline-flex items-center gap-[7px] pt-[9px] pr-[11px] pb-[9px] pl-[11px] [border:1px_solid_#fff9] rounded-[3px] bg-[#fffcf0ed] text-[#4c654b] text-[11px] font-semibold tracking-[1.1px] [&_>_svg]:stroke-[1.4] max-[600px]:left-4 max-[600px]:top-4 max-[600px]:text-[11px] max-[600px]:tracking-[.8px] max-[600px]:pt-2 max-[600px]:pr-2 max-[600px]:pb-2 max-[600px]:pl-2",
  benefits: "dgs-north-east-benefits-benefits grid grid-cols-[repeat(2,_minmax(0,_1fr))] gap-x-8 max-[1100px]:gap-x-[21px] max-[800px]:gap-x-8 max-[600px]:gap-x-5.5",
  benefit: "dgs-north-east-benefits-benefit pt-[7px] pr-0 pb-[23px] pl-0 [&:nth-child(n_+_3)]:[border-top:1px_solid_#d9ddcc] [&:nth-child(n_+_3)]:pt-[25px] [&:nth-child(n_+_3)]:pb-[5px] [&_h3]:max-w-[290px] [&_h3]:font-serif [&_h3]:text-[23px] [&_h3]:font-normal [&_h3]:leading-[1.14] [&_h3]:tracking-[-.4px] [&_p]:mt-2.5 [&_p]:max-w-[310px] [&_p]:text-[#5f6b5a] [&_p]:text-[15px] [&_p]:leading-[1.8] max-[1100px]:[&_h3]:text-[21px] max-[1100px]:[&_p]:text-[14px] max-[800px]:[&_h3]:max-w-[260px] max-[800px]:[&_h3]:text-[23px] max-[800px]:[&_p]:max-w-[300px] max-[800px]:[&_p]:text-[16px] max-[800px]:pt-0 max-[800px]:pb-6 max-[600px]:[&_h3]:text-[21px] max-[600px]:[&_p]:text-[15px] max-[600px]:[&_p]:leading-[1.75] max-[600px]:[&_p]:mt-2.5 max-[600px]:[&:nth-child(n_+_3)]:pt-[23px] [@media(hover:hover)]:motion-safe:[&:hover_.dgs-north-east-benefits-icon]:bg-[#e2e7d5] [@media(hover:hover)]:motion-safe:[&:hover_.dgs-north-east-benefits-icon]:[border-color:#a6b68d] [@media(hover:hover)]:motion-safe:[&:hover_.dgs-north-east-benefits-icon]:text-[#3e6549]",
  icon: "dgs-north-east-benefits-icon grid place-items-center w-[43px] h-[43px] [border:1px_solid_#cdd4bd] rounded-full text-[#5c6d4a] bg-[#fbfaf17a] mb-[13px] [transition:background_.3s_ease,_color_.3s_ease,_border-color_.3s_ease] max-[600px]:w-[39px] max-[600px]:h-[39px] max-[600px]:mb-3 max-[600px]:[&_>_svg]:w-[23px] max-[600px]:[&_>_svg]:h-[23px] motion-reduce:transition-none",
  nextStep: "dgs-north-east-benefits-nextStep flex items-center justify-between gap-7 mt-7.5 pt-6.5 pr-7.5 pb-6.5 pl-7.5 [border:1px_solid_#174d3d] rounded-[6px] bg-[#073c32] text-[#fffbee] [&_h3]:font-serif [&_h3]:text-[24px] [&_h3]:leading-[1.2] [&_h3]:tracking-[-.4px] [&_p]:mt-[7px] [&_p]:text-[#c0d0bf] [&_p]:text-[14px] [&_p]:leading-[1.75] max-[1100px]:pt-[23px] max-[1100px]:pr-[23px] max-[1100px]:pb-[23px] max-[1100px]:pl-[23px] max-[1100px]:gap-5 max-[1100px]:[&_h3]:text-[22px] max-[800px]:items-start max-[800px]:flex-col max-[800px]:gap-5 max-[800px]:[&_h3]:text-[24px] max-[800px]:[&_p]:text-[15px] max-[600px]:pt-[23px] max-[600px]:pr-[21px] max-[600px]:pb-[23px] max-[600px]:pl-[21px] max-[600px]:mt-[27px] max-[600px]:[&_h3]:max-w-[260px] max-[600px]:[&_h3]:text-[25px] max-[600px]:[&_p]:mt-2.5 max-[600px]:[&_p]:text-[15px]",
  nextStepCopy: "dgs-north-east-benefits-nextStepCopy flex items-center gap-5 max-[1100px]:gap-3.5",
  nextStepIcon: "dgs-north-east-benefits-nextStepIcon grid place-items-center w-13 h-13 flex-none [border:1px_solid_#d8c28645] rounded-full text-[#dec68b] max-[1100px]:hidden",
  eligibility: "dgs-north-east-benefits-eligibility block mt-[9px] text-[#d8c9a3] text-[12px] tracking-[.35px] max-[800px]:text-[13px] max-[600px]:text-[12px] max-[600px]:mt-3",
  enquire: "dgs-north-east-benefits-enquire inline-flex items-center justify-center gap-5.5 flex-none min-h-11.5 pt-3 pr-4.5 pb-3 pl-4.5 [border:1px_solid_#e7c78d] rounded-[4px] bg-[#ecd2a0] text-[#143c30] text-[15px] font-[650] [transition:background_.25s_ease] [&:hover]:bg-[#f7dfb3] [&_>_svg]:[transition:transform_.25s_ease] [&:hover_>_svg]:[transform:translate(2px,_-2px)] max-[1100px]:gap-3 max-[1100px]:pl-3.5 max-[1100px]:pr-3.5 max-[1100px]:text-[14px] max-[800px]:min-h-11.5 max-[800px]:text-[15px] max-[800px]:gap-5.5 max-[600px]:w-full max-[600px]:justify-between max-[600px]:pl-[15px] max-[600px]:pr-[15px] motion-reduce:transition-none motion-reduce:[&_>_svg]:transition-none",
};


const benefits = [
  {
    icon: GraduationCap,
    title: "A strong academic foundation",
    description: "CBSE learning and time for focused study help your child build the habits and confidence for their next chapter.",
  },
  {
    icon: Compass,
    title: "More ways to discover themselves",
    description: "Sports, robotics, music and creative activities give students the space to explore interests beyond the classroom.",
  },
  {
    icon: Users,
    title: "Friendships that widen their world",
    description: "Shared school life brings new perspectives, teamwork and opportunities to make meaningful friendships.",
  },
  {
    icon: House,
    title: "Independence, one day at a time",
    description: "A boarding routine with time for learning, meals, play and rest helps students practise everyday responsibility.",
  },
];

export default function NorthEastBenefits({ onEnquire }: { onEnquire: () => void }) {
  return (
    <section className={ui.section} id="boarding" aria-labelledby="north-east-heading">
      <div className={"dgs-container w-[calc(100%_-_128px)] max-w-[1280px] ml-auto mr-auto max-[1150px]:w-[calc(100%_-_80px)] max-[900px]:w-[calc(100%_-_56px)] max-[760px]:w-[calc(100%_-_40px)] max-[370px]:w-[calc(100%_-_32px)]"}>
        <div className={ui.heading} data-reveal>
          <div>
            <p className={ui.eyebrow}><span aria-hidden="true" /> FOR FAMILIES IN SILIGURI & NORTH EAST INDIA</p>
            <h2 id="north-east-heading">North East roots.<br /><em>Brighter horizons.</em></h2>
          </div>
          <p className={ui.introduction}>For families from {ADMISSION_CITY_LABEL}, discover what a new chapter at DGS can offer your child—inside and beyond the classroom.</p>
        </div>

        <div className={ui.content}>
          <figure className={ui.visual} data-reveal data-parallax>
            <Image
              src="/images/life-at-dgs/boarding.webp"
              alt="Illustrative North East Indian students sharing a friendly moment in a boarding-school common room"
              fill
              sizes="(max-width: 800px) 100vw, (max-width: 1440px) 40vw, 510px"
            />
            <span className={ui.location}><MapPin size={13} aria-hidden="true" /> A NEW CHAPTER IN DEHRADUN</span>
            <figcaption><span>LEARN. CONNECT. GROW.</span><p>Different roots.<br /><em>Shared discoveries.</em></p></figcaption>
          </figure>

          <div className={ui.benefits}>
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <article className={ui.benefit} key={title} data-reveal data-reveal-delay={index % 2 + 1}>
                <span className={ui.icon}><Icon size={25} strokeWidth={1.3} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={ui.nextStep} data-reveal>
          <div className={ui.nextStepCopy}>
            <span className={ui.nextStepIcon}><Compass size={27} strokeWidth={1.2} aria-hidden="true" /></span>
            <div>
              <h3>A clearer next step, even from afar.</h3>
              <p>Talk through classes, boarding, fees and a campus visit with admissions.</p>
              <span className={ui.eligibility}>Boys’ boarding · Classes 3–12 · Dehradun</span>
            </div>
          </div>
          <button className={ui.enquire} onClick={onEnquire} aria-haspopup="dialog">Plan your child’s next step <ArrowUpRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
