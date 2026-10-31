import Image from "next/image";
import { ArrowRight, ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ADMISSION_CITY_LABEL } from "@/lib/enquiry";

// Static Tailwind utility groups keep the markup and responsive states readable.
const ui: Record<string, string> = {
  footer: "dgs-site-footer-footer relative overflow-hidden isolate bg-[#052f27] text-[#faf7e9] [border-top:2px_solid_#c9ae72] [&::before]:content-[''] [&::before]:absolute [&::before]:top-0 [&::before]:right-0 [&::before]:bottom-0 [&::before]:left-0 [&::before]:-z-1 [&::before]:[background:radial-gradient(ellipse_at_95%_0%,_#65865a22,_transparent_55%)] [&::before]:pointer-events-none max-[760px]:pb-[61px]",
  horizon: "dgs-site-footer-horizon absolute top-[-300px] -right-25 w-[520px] h-[520px] [border:1px_solid_#d6bd7e12] rounded-full shadow-[0_0_0_45px_#d6bd7e04] -z-1 pointer-events-none",
  inner: "dgs-site-footer-inner relative",
  invitation: "dgs-site-footer-invitation flex items-center justify-between gap-8 pt-7 pb-7 [border-bottom:1px_solid_#d3d9b42b] [&_h2]:text-[clamp(28px,_2.5vw,_36px)] [&_h2]:leading-[1.15] [&_h2]:tracking-[-.7px] [&_h2_em]:text-[#e4c990] [&_h2_em]:whitespace-nowrap max-[760px]:gap-5 max-[760px]:[&_h2]:text-[29px] max-[600px]:block max-[600px]:pt-6 max-[600px]:pb-6 max-[600px]:[&_h2]:max-w-[310px] max-[600px]:[&_h2]:text-[29px] max-[600px]:[&_h2]:tracking-[-.5px]",
  eyebrow: "dgs-site-footer-eyebrow flex items-center gap-2 text-[#d7bd82] text-[13px] tracking-[1.5px] font-semibold mb-[9px] [&_>_span]:w-[5px] [&_>_span]:h-[5px] [&_>_span]:rounded-full [&_>_span]:bg-[#d8bd79] [&_>_span]:shadow-[0_0_0_4px_#d8bd7912] max-[600px]:text-[12px] max-[600px]:tracking-[1.25px] max-[600px]:mb-2",
  invitationText: "dgs-site-footer-invitationText text-[15px] text-[#b8caba] leading-[1.6] mt-2 max-[600px]:text-[15px] max-[600px]:max-w-[280px] max-[600px]:mt-[7px]",
  admissions: "dgs-site-footer-admissions w-[340px] flex-none max-[1100px]:w-[310px] max-[760px]:w-[270px] max-[600px]:mt-4 max-[600px]:w-full",
  callback: "dgs-site-footer-callback flex items-center justify-between gap-3 min-h-11.5 pt-3 pr-4 pb-3 pl-4 w-full [border:1px_solid_#e8ce95] rounded-[4px] bg-[#e9cf98] text-[#153c2f] text-[15px] font-[650] [transition:background_.25s_ease,_box-shadow_.25s_ease] [&_svg]:flex-none [&:hover]:bg-[#f5deb1] [&:hover]:shadow-[0_6px_24px_#0002] max-[760px]:pl-3 max-[760px]:pr-3 max-[760px]:text-[14px] max-[760px]:gap-2 max-[600px]:min-h-11 max-[600px]:text-[15px] max-[600px]:pt-2.5 max-[600px]:pr-3.5 max-[600px]:pb-2.5 max-[600px]:pl-3.5 motion-reduce:transition-none",
  admissionsNote: "dgs-site-footer-admissionsNote mt-2 text-[#b6c6b0] text-[13px] text-center max-[600px]:text-[13px] max-[600px]:mt-[7px]",
  main: "dgs-site-footer-main grid grid-cols-[1.3fr_.8fr_1fr] gap-15 pt-7 pb-7 [&_>_*]:min-w-0 [&_h3]:font-sans [&_h3]:text-[#d1bc85] [&_h3]:text-[13px] [&_h3]:font-[550] [&_h3]:tracking-[1.3px] [&_h3]:mt-[3px] [&_h3]:mr-0 [&_h3]:mb-[13px] [&_h3]:ml-0 max-[1100px]:grid-cols-[1.2fr_.85fr_1fr] max-[1100px]:gap-8 max-[760px]:grid-cols-[1fr_1fr] max-[760px]:gap-6 max-[760px]:pt-6 max-[760px]:pb-6 max-[600px]:grid-cols-[.9fr_1.1fr] max-[600px]:gap-[22px_20px] max-[600px]:[&_h3]:text-[12px] max-[600px]:[&_h3]:tracking-[1.2px] max-[600px]:[&_h3]:mt-0 max-[600px]:[&_h3]:mr-0 max-[600px]:[&_h3]:mb-2.5 max-[600px]:[&_h3]:ml-0",
  identity: "dgs-site-footer-identity [&_>_a]:inline-block [&_img]:object-contain [&_img]:w-23.5 [&_img]:h-[69px] max-[760px]:col-[1_/_-1] max-[760px]:flex max-[760px]:items-center max-[760px]:gap-6 max-[600px]:gap-5 max-[600px]:pb-5 max-[600px]:[border-bottom:1px_solid_#c9d5ad1c] max-[600px]:[&_>_a]:flex-none max-[600px]:[&_img]:w-21.5 max-[600px]:[&_img]:h-[63px]",
  contact: "dgs-site-footer-contact mt-3.5 [&_>_p]:text-[13px] [&_>_p]:leading-[1.6] [&_>_p]:text-[#a8bea1] [&_>_p]:mt-2 max-[760px]:mt-0 max-[600px]:[&_>_p]:text-[12px] max-[600px]:[&_>_p]:mt-1.5",
  phone: "dgs-site-footer-phone flex items-center gap-[9px] w-fit font-serif text-[22px] leading-[1.3] text-[#f3e3c0] whitespace-nowrap [&_svg]:flex-none [&_svg]:stroke-[1.4] [&_svg]:text-[#cfbd8b] [&:hover]:text-[#fff2cd] max-[1100px]:text-[21px] max-[600px]:text-[20px] max-[600px]:gap-[7px] max-[600px]:[&_svg]:w-[13px]",
  email: "dgs-site-footer-email flex items-center gap-2 w-fit text-[#c0cfb7] text-[15px] leading-[1.6] mt-[7px] [&_svg]:flex-none [&_svg]:stroke-[1.3] [&_svg]:text-[#c2b888] [&_>_span]:[overflow-wrap:anywhere] [&:hover]:text-[#fff2cd] max-[1100px]:text-[14px] max-[600px]:gap-1.5 max-[600px]:text-[14px] max-[600px]:mt-1.5 max-[600px]:items-start max-[600px]:[&_svg]:w-3 max-[600px]:[&_svg]:mt-[1px]",
  explore: "dgs-site-footer-explore [&_>_a]:flex [&_>_a]:items-center [&_>_a]:gap-2.5 [&_>_a]:w-fit [&_>_a]:min-h-7 [&_>_a]:text-[16px] [&_>_a]:text-[#c3d0bc] [&_>_a]:pt-[5px] [&_>_a]:pb-[5px] [&_>_a]:[transition:color_.25s_ease] [&_>_a_svg]:opacity-0 [&_>_a_svg]:[translate:-4px_0] [&_>_a_svg]:[transition:opacity_.25s_ease,_translate_.25s_ease] [&_>_a_svg]:text-[#ddc48b] [&_>_a:hover]:text-[#f2deb0] [&_>_a:focus-visible]:text-[#f2deb0] [&_>_a:hover_svg]:opacity-100 [&_>_a:hover_svg]:[translate:0_0] [&_>_a:focus-visible_svg]:opacity-100 [&_>_a:focus-visible_svg]:[translate:0_0] max-[600px]:[&_>_a]:text-[15px] max-[600px]:[&_>_a]:gap-0 max-[600px]:[&_>_a]:min-h-7 max-[600px]:[&_>_a_svg]:hidden motion-reduce:[&_>_a]:transition-none motion-reduce:[&_>_a_svg]:transition-none",
  locationLabel: "dgs-site-footer-locationLabel flex items-center gap-[7px] text-[#e0e6d3] text-[16px] leading-[1.6] mb-1.5 [&_svg]:flex-none [&_svg]:text-[#b6bd8a] [&_svg]:stroke-[1.3] max-[600px]:items-start max-[600px]:text-[15px] max-[600px]:gap-[5px] max-[600px]:leading-[1.5] max-[600px]:[&_svg]:w-3 max-[600px]:[&_svg]:mt-[1px]",
  visit: "dgs-site-footer-visit [&_address]:text-[#b8c9b2] [&_address]:not-italic [&_address]:text-[15px] [&_address]:leading-[1.7] max-[600px]:[&_address]:text-[14px]",
  textButton: "dgs-site-footer-textButton flex items-center gap-3 min-h-7.5 pt-[5px] pr-0 pb-[5px] pl-0 mt-2.5 [border:0] [border-bottom:1px_solid_#c7b2796b] bg-[transparent] text-[#e8d3a3] text-[15px] font-medium [&_>_svg]:flex-none [&_>_svg]:[transition:transform_.25s_ease] [&:hover_>_svg]:[transform:translateX(3px)] max-[600px]:text-[14px] max-[600px]:gap-2 max-[600px]:mt-2 motion-reduce:[&_>_svg]:transition-none",
  official: "dgs-site-footer-official [&_>_svg]:flex-none [&_>_svg]:[transition:transform_.25s_ease] flex items-center gap-[7px] w-fit min-h-7 mt-[5px] text-[#b7c8ae] text-[14px] [&:hover]:text-[#f0dba9] max-[600px]:text-[13px] max-[600px]:gap-[5px] motion-reduce:[&_>_svg]:transition-none",
  bottom: "dgs-site-footer-bottom [border-top:1px_solid_#c9d5ad2b] flex justify-between items-center gap-5 pt-3 pb-3 text-[#aebfa5] text-[14px] [&_>_div]:flex [&_>_div]:gap-6 [&_>_div]:items-center [&_button]:bg-transparent [&_button]:pt-1.5 [&_button]:pr-0 [&_button]:pb-1.5 [&_button]:pl-0 [&_button]:[border:0] [&_button]:text-[inherit] [&_button]:text-[#c2ceb5] [&_button:hover]:text-[#f4dfb0] max-[760px]:text-[13px] max-[760px]:gap-3 max-[760px]:[&_>_div]:gap-4 max-[600px]:flex-col max-[600px]:items-stretch max-[600px]:gap-2 max-[600px]:pt-3 max-[600px]:pb-3 max-[600px]:[&_>_div]:justify-between",
  backToTop: "dgs-site-footer-backToTop flex items-center gap-2.5 text-[#d5d7b9] [&_>_span]:w-7 [&_>_span]:h-7 [&_>_span]:[border:1px_solid_#c4c49266] [&_>_span]:rounded-full [&_>_span]:grid [&_>_span]:place-items-center [&_>_span]:[transition:background_.25s_ease,_color_.25s_ease] [&_svg]:[transition:transform_.25s_ease] [&:hover_>_span]:bg-[#e0c78f] [&:hover_>_span]:text-[#123b30] [&:hover_svg]:[transform:translateY(-2px)] motion-reduce:[&_>_span]:transition-none motion-reduce:[&_svg]:transition-none",
  credit: "dgs-site-footer-credit max-w-[1110px] text-[13px] text-[#9db497] leading-[1.6] pb-4 max-[600px]:text-[12px] max-[600px]:pb-4",
};


const links = [
  { label: "North East admission drive", href: "#admission-drive" },
  { label: "Why Doon Global", href: "#why-dgs" },
  { label: "Life at DGS", href: "#life-at-dgs" },
  { label: "Boarding & belonging", href: "#boarding" },
  { label: "Our programmes", href: "#programmes" },
  { label: "Admission FAQs", href: "#faqs" },
];

export default function SiteFooter({ onEnquire, onPrivacy }: { onEnquire: () => void; onPrivacy: () => void }) {
  return (
    <footer className={ui.footer} id="contact">
      <div className={ui.horizon} aria-hidden="true" />
      <div className={`dgs-container w-[calc(100%_-_128px)] max-w-[1280px] ml-auto mr-auto max-[1150px]:w-[calc(100%_-_80px)] max-[900px]:w-[calc(100%_-_56px)] max-[760px]:w-[calc(100%_-_40px)] max-[370px]:w-[calc(100%_-_32px)] ${ui.inner}`}>
        <div className={ui.invitation}>
          <div data-reveal>
            <p className={ui.eyebrow}><span aria-hidden="true" /> ADMISSIONS OPEN 2027–28</p>
            <h2>Their next chapter. <em>Let’s begin.</em></h2>
            <p className={ui.invitationText}>Welcoming families from {ADMISSION_CITY_LABEL}.</p>
          </div>
          <div className={ui.admissions} data-reveal data-reveal-delay="1">
            <button className={ui.callback} onClick={onEnquire} aria-haspopup="dialog">Request an admissions callback <ArrowUpRight size={19} aria-hidden="true" /></button>
            <p className={ui.admissionsNote}>Boys’ boarding · Classes 3–12 · CBSE</p>
          </div>
        </div>

        <div className={ui.main}>
          <div className={ui.identity} data-reveal>
            <a href="#home" aria-label="Doon Global School home"><Image src="/images/logo-white.webp" alt="Doon Global School" width={116} height={85} /></a>
            <div className={ui.contact}>
              <a className={ui.phone} href="tel:+917455997333"><Phone size={15} aria-hidden="true" /> +91 74559 97333</a>
              <a className={ui.email} href="mailto:admissions@doonglobalschool.edu.in"><Mail size={14} aria-hidden="true" /><span>admissions@<wbr />doonglobalschool.edu.in</span></a>
              <p>CBSE education · A legacy since 1998</p>
            </div>
          </div>

          <nav className={ui.explore} aria-label="Footer navigation" data-reveal data-reveal-delay="1">
            <h3>EXPLORE DGS</h3>
            {links.map(link => <a key={link.href} href={link.href}>{link.label}<ArrowUpRight size={12} aria-hidden="true" /></a>)}
          </nav>

          <div className={ui.visit} data-reveal data-reveal-delay="2">
            <h3>VISIT OUR CAMPUS</h3>
            <span className={ui.locationLabel}><MapPin size={15} aria-hidden="true" /> Dehradun, Uttarakhand</span>
            <address>Chakrata Road<br />Jhajra, Dehradun</address>
            <button className={ui.textButton} onClick={onEnquire} aria-haspopup="dialog">Plan a campus visit <ArrowRight size={14} aria-hidden="true" /></button>
            <a className={ui.official} href="https://doonglobalschool.edu.in/" target="_blank" rel="noopener noreferrer">Official school website <ArrowUpRight size={12} aria-hidden="true" /></a>
          </div>
        </div>

        <div className={ui.bottom}>
          <p>© {new Date().getFullYear()} Doon Global School. All rights reserved.</p>
          <div><button onClick={onPrivacy}>Privacy details</button><a className={ui.backToTop} href="#home">Back to top <span><ArrowUp size={15} aria-hidden="true" /></span></a></div>
        </div>
        <p className={ui.credit}>School-life cards feature DGS student photographs. Selected campaign visuals are illustrative. Campus photographs are from the school’s official website. Confirm current facilities, programme access and fees with admissions.</p>
      </div>
    </footer>
  );
}
