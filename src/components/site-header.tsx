"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, MapPin, Phone, X } from "lucide-react";

// Static Tailwind utility groups keep the markup and responsive states readable.
const ui: Record<string, string> = {
  topAnchor: "dgs-site-header-topAnchor h-0 scroll-mt-0",
  header: "dgs-site-header-header [--header-height:104px] [--logo-width:108px] [--logo-height:79px] fixed top-0 right-0 bottom-auto left-0 z-45 isolate bg-[transparent] text-[#173f32] [&::before]:content-[''] [&::before]:absolute [&::before]:top-0 [&::before]:right-0 [&::before]:bottom-0 [&::before]:left-0 [&::before]:-z-1 [&::before]:bg-[#fbfaf4f5] [&::before]:[border-bottom:1px_solid_#dce1d0] [&::before]:shadow-[0_6px_24px_#173a2710] [&::before]:[backdrop-filter:blur(16px)] [&::before]:opacity-0 [&::before]:[transform:translateY(-8px)] [&::before]:[transition:opacity_.4s_ease,_transform_.4s_cubic-bezier(.22,_1,_.36,_1)] [&[data-scrolled=true]]:[--header-height:82px] [&[data-scrolled=true]]:[--logo-width:94px] [&[data-scrolled=true]]:[--logo-height:69px] [&[data-scrolled=true]::before]:opacity-100 [&[data-scrolled=true]::before]:[transform:translateY(0)] [&[data-menu-open=true]::before]:opacity-100 [&[data-menu-open=true]::before]:[transform:translateY(0)] max-[1050px]:[--header-height:96px] max-[700px]:[--header-height:88px] max-[700px]:[--logo-width:88px] max-[700px]:[--logo-height:65px] max-[700px]:[&[data-scrolled=true]]:[--header-height:74px] max-[700px]:[&[data-scrolled=true]]:[--logo-width:82px] max-[700px]:[&[data-scrolled=true]]:[--logo-height:60px] max-[370px]:[--logo-width:83px] motion-reduce:[&::before]:transition-none",
  shell: "dgs-site-header-shell relative w-full",
  inner: "dgs-site-header-inner w-[calc(100%_-_128px)] max-w-[1280px] ml-auto mr-auto h-[var(--header-height)] flex items-center justify-between gap-7.5 [transition:height_.4s_cubic-bezier(.22,_1,_.36,_1)] max-[1150px]:w-[calc(100%_-_80px)] max-[1150px]:gap-5.5 max-[700px]:w-[calc(100%_-_40px)] max-[700px]:gap-3.5 max-[370px]:w-[calc(100%_-_32px)] max-[370px]:gap-2.5 motion-reduce:transition-none",
  brand: "dgs-site-header-brand inline-flex items-center flex-none [&_>_img]:w-[var(--logo-width)] [&_>_img]:h-[var(--logo-height)] [&_>_img]:object-contain [&_>_img]:[transition:width_.4s_cubic-bezier(.22,_1,_.36,_1),_height_.4s_cubic-bezier(.22,_1,_.36,_1)] motion-reduce:[&_>_img]:transition-none",
  navigation: "dgs-site-header-navigation flex items-center justify-center gap-8 [&_>_a]:relative [&_>_a]:pt-[15px] [&_>_a]:pb-[15px] [&_>_a]:text-[12px] [&_>_a]:font-medium [&_>_a]:leading-[1.5] [&_>_a]:whitespace-nowrap [&_>_a]:text-[#455e48] [&_>_a]:[transition:color_.2s] [&_>_a::after]:content-[''] [&_>_a::after]:absolute [&_>_a::after]:bottom-1.5 [&_>_a::after]:left-0 [&_>_a::after]:w-full [&_>_a::after]:h-[1px] [&_>_a::after]:bg-[#ad8b4d] [&_>_a::after]:[transform:scaleX(0)] [&_>_a::after]:[transform-origin:left] [&_>_a::after]:[transition:transform_.3s_cubic-bezier(.16,_1,_.3,_1)] [&_>_a:hover]:text-[#173f32] [&_>_a[aria-current]]:text-[#173f32] [&_>_a:hover::after]:[transform:scaleX(1)] [&_>_a[aria-current]::after]:[transform:scaleX(1)] max-[1150px]:gap-[25px] max-[1050px]:hidden motion-reduce:[&_>_a]:transition-none motion-reduce:[&_>_a::after]:transition-none",
  actions: "dgs-site-header-actions flex items-center gap-[25px] flex-none max-[1150px]:gap-4.5 max-[700px]:gap-[13px] max-[370px]:gap-2.5",
  phone: "dgs-site-header-phone flex gap-2 items-center text-[#38553e] [&:hover]:text-[#9a753c]",
  phoneIcon: "dgs-site-header-phoneIcon grid place-items-center w-[23px] h-[35px] text-[#7b8f64] [&_svg]:stroke-[1.5] max-[700px]:w-5.5 max-[700px]:[&_svg]:w-[15px]",
  phoneText: "dgs-site-header-phoneText text-[11px] font-[550] whitespace-nowrap max-[1150px]:hidden max-[1050px]:block max-[700px]:hidden",
  enquire: "dgs-site-header-enquire inline-flex items-center justify-center gap-4.5 min-h-[43px] pt-3 pr-4.5 pb-3 pl-4.5 [border:1px_solid_#073c32] rounded-[3px] bg-[#073c32] text-[#fffbee] text-[11px] font-semibold [transition:background_.2s] [&:hover]:bg-[#15513d] [&_svg]:text-[#e5c37a] [&_svg]:[transition:transform_.25s] [&:hover_svg]:[transform:translate(2px,_-2px)] max-[700px]:min-h-[37px] max-[700px]:pt-2.5 max-[700px]:pr-3 max-[700px]:pb-2.5 max-[700px]:pl-3 max-[700px]:text-[10px] max-[700px]:gap-2.5 max-[700px]:[&_svg]:w-3.5 max-[700px]:[&_svg]:h-3.5 max-[370px]:pl-2.5 max-[370px]:pr-2.5 max-[370px]:gap-2 max-[370px]:text-[9px] motion-reduce:transition-none motion-reduce:[&_svg]:transition-none",
  toggle: "dgs-site-header-toggle hidden items-center justify-center flex-none w-8.5 h-9.5 pt-[7px] pr-[7px] pb-[7px] pl-[7px] [border:0] bg-transparent text-[#173f32] max-[1050px]:flex max-[700px]:w-[27px] max-[700px]:pt-[3px] max-[700px]:pr-[3px] max-[700px]:pb-[3px] max-[700px]:pl-[3px]",
  menuLines: "dgs-site-header-menuLines flex flex-col items-end gap-1.5 w-5 [&_>_span]:h-[1.5px] [&_>_span]:w-5 [&_>_span]:bg-[#173f32] [&_>_span:last-child]:w-3.5",
  mobileMenu: "dgs-site-header-mobileMenu absolute top-full left-0 right-0 pt-[23px] pr-7 pb-6.5 pl-7 max-h-[calc(100dvh_-_145px)] overflow-auto bg-[#fbfaf4] [border-block:1px_solid_#dce1d0] shadow-[0_15px_25px_#173a2714] [&_>_a]:flex [&_>_a]:items-center [&_>_a]:justify-between [&_>_a]:pt-[17px] [&_>_a]:pr-0 [&_>_a]:pb-[17px] [&_>_a]:pl-0 [&_>_a]:[border-bottom:1px_solid_#e0e4d4] [&_>_a]:text-[#36533e] [&_>_a]:text-[14px] [&_>_a]:font-medium [&_>_a]:leading-[1.4] [&_>_a_>_svg]:text-[#83916e] [&_>_a_>_svg]:stroke-[1.4] [&_>_a[aria-current]]:text-[#96773f] max-[700px]:pl-5.5 max-[700px]:pr-5.5",
  mobileIntro: "dgs-site-header-mobileIntro text-[8px] font-medium tracking-[1.5px] text-[#879474] mb-[9px]",
  mobileFooter: "dgs-site-header-mobileFooter pt-5 [&_p]:flex [&_p]:items-center [&_p]:gap-1.5 [&_p]:text-[10px] [&_p]:text-[#849078] [&_>_button]:flex [&_>_button]:items-center [&_>_button]:justify-between [&_>_button]:w-full [&_>_button]:mt-4 [&_>_button]:pt-[13px] [&_>_button]:pr-[15px] [&_>_button]:pb-[13px] [&_>_button]:pl-[15px] [&_>_button]:[border:1px_solid_#073c32] [&_>_button]:rounded-[3px] [&_>_button]:bg-[#073c32] [&_>_button]:text-[#fffbee] [&_>_button]:text-[12px] [&_>_button]:font-medium [&_>_button_svg]:text-[#e5c37a]",
};


const navigation = [
  { label: "Why DGS", href: "#why-dgs" },
  { label: "Boarding life", href: "#boarding" },
  { label: "Learning & beyond", href: "#life-at-dgs" },
  { label: "Our programmes", href: "#programmes" },
];

export default function SiteHeader({ onEnquire }: { onEnquire: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function updateScroll() {
      setScrolled(window.scrollY > 64);
      if (window.scrollY < 100) setActiveSection(null);
    }
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
    }, { rootMargin: "-22% 0px -55% 0px" });
    for (const { href } of navigation) {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    }
    return () => { window.removeEventListener("scroll", updateScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenuOpen(false); toggleRef.current?.focus(); }
    }
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    }
    function resize() { if (window.innerWidth > 1050) setMenuOpen(false); }
    window.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", resize);
    };
  }, [menuOpen]);

  function enquire() { setMenuOpen(false); onEnquire(); }

  return <>
    <div id="home" className={ui.topAnchor} aria-hidden="true" />
    <header ref={headerRef} className={ui.header} data-scrolled={scrolled} data-menu-open={menuOpen}>
      <div className={ui.shell}>
        <div className={ui.inner}>
          <a href="#home" className={ui.brand} aria-label="Doon Global School home" onClick={() => setMenuOpen(false)}>
            <Image src="/images/logo.webp" alt="Doon Global School" width={116} height={85} loading="eager" />
          </a>

          <nav className={ui.navigation} aria-label="Main navigation">
            {navigation.map(item => <a key={item.href} href={item.href} aria-current={activeSection === item.href ? "location" : undefined} onClick={() => setActiveSection(item.href)}>{item.label}<span aria-hidden="true" /></a>)}
          </nav>

          <div className={ui.actions}>
            <a className={ui.phone} href="tel:+917455997333" aria-label="Call admissions on +91 74559 97333">
              <span className={ui.phoneIcon}><Phone size={16} /></span>
              <span className={ui.phoneText}>+91 74559 97333</span>
            </a>
            <button className={ui.enquire} onClick={enquire} aria-label="Enquire about admissions" aria-haspopup="dialog">Enquire now <ArrowUpRight size={17} /></button>
            <button ref={toggleRef} className={ui.toggle} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <span className={ui.menuLines} aria-hidden="true"><span /><span /></span>}
            </button>
          </div>
        </div>

        {menuOpen && <nav className={ui.mobileMenu} id="mobile-menu" aria-label="Mobile navigation">
          <div className={ui.mobileIntro}>DISCOVER DOON GLOBAL</div>
          {navigation.map(item => <a key={item.href} href={item.href} aria-current={activeSection === item.href ? "location" : undefined} onClick={() => { setActiveSection(item.href); setMenuOpen(false); }}>{item.label}<ArrowUpRight size={17} /></a>)}
          <div className={ui.mobileFooter}><p><MapPin size={13} /> Dehradun, Uttarakhand</p><button onClick={enquire} aria-haspopup="dialog">Admissions 2027–28 <ArrowRight size={16} /></button></div>
        </nav>}
      </div>
    </header>
  </>;
}
