import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  src: "../../public/fonts/figtree.woff2",
  variable: "--font-figtree",
  weight: "400 700",
  display: "swap",
});

const serif = localFont({
  src: [
    { path: "../../public/fonts/fraunces.woff2", weight: "400 600", style: "normal" },
    { path: "../../public/fonts/fraunces-italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const baseClasses = [
  "m-0 bg-ivory font-sans text-[16px] font-normal text-ink antialiased [line-height:normal] selection:bg-gold selection:text-deep",
  "has-[.admissions-dialog[open]]:overflow-hidden has-[.privacy-dialog[open]]:overflow-hidden",
  "[:where(&_h1,&_h2)]:font-serif [:where(&_h1,&_h2)]:leading-[1.08] [:where(&_h1,&_h2)]:tracking-[-1.8px] [:where(&_h2)]:text-[clamp(36px,3.5vw,51px)]",
  "[:where(&_h1,&_h2,&_h3)]:font-normal [:where(&_p)]:leading-[1.75] [:where(&_em)]:font-normal [:where(&_em)]:italic",
  "[:where(&_button)]:cursor-pointer [:where(&_button:disabled)]:cursor-wait [:where(&_button:disabled)]:opacity-75",
  "[:where(&_button,&_a)]:touch-manipulation [:where(&_button,&_a,&_input,&_select)]:[-webkit-tap-highlight-color:transparent]",
  "[:where(&_button:focus-visible,&_a:focus-visible,&_input:focus-visible,&_select:focus-visible,&_[tabindex]:focus-visible)]:outline-3 [:where(&_button:focus-visible,&_a:focus-visible,&_input:focus-visible,&_select:focus-visible,&_[tabindex]:focus-visible)]:outline-[#bd8629] [:where(&_button:focus-visible,&_a:focus-visible,&_input:focus-visible,&_select:focus-visible,&_[tabindex]:focus-visible)]:outline-offset-[5px]",
  "motion-safe:[&_[data-reveal]]:transition-[opacity,translate] motion-safe:[&_[data-reveal]]:duration-[850ms] motion-safe:[&_[data-reveal]]:ease-[cubic-bezier(.16,1,.3,1)]",
  "motion-safe:[&_[data-reveal-state=pending]]:opacity-0 motion-safe:[&_[data-reveal-state=pending]]:translate-y-6",
  "motion-safe:[&_[data-reveal-state=visible]]:opacity-100 motion-safe:[&_[data-reveal-state=visible]]:translate-y-0",
  "motion-safe:[&_[data-reveal-state=visible][data-reveal-delay='1']]:delay-[80ms] motion-safe:[&_[data-reveal-state=visible][data-reveal-delay='2']]:delay-[160ms] motion-safe:[&_[data-reveal-state=visible][data-reveal-delay='3']]:delay-[240ms]",
  "motion-safe:[&_[data-reveal-state=visible][data-reveal-delay='4']]:delay-[320ms] motion-safe:[&_[data-reveal-state=visible][data-reveal-delay='5']]:delay-[400ms] motion-safe:[&_[data-reveal-state=visible][data-reveal-delay='6']]:delay-[480ms]",
  "motion-safe:[&_[data-reveal-state=pending][data-reveal-from=right]]:translate-y-0 motion-safe:[&_[data-reveal-state=pending][data-reveal-from=right]]:translate-x-8 motion-safe:[&_[data-reveal-state=visible][data-reveal-from=right]]:translate-x-0",
  "[&_[data-reveal]:focus-within]:opacity-100 [&_[data-reveal]:focus-within]:translate-y-0 [&_[data-reveal]:focus-within]:translate-x-0 [&_[data-reveal]:focus-within]:transition-none",
  "motion-reduce:[&_*]:transition-none! motion-reduce:[&_*]:animate-none! motion-reduce:[&_*::before]:transition-none! motion-reduce:[&_*::after]:transition-none!",
  "print:[&_[data-reveal]]:opacity-100! print:[&_[data-reveal]]:translate-y-0! print:[&_[data-reveal]]:translate-x-0!",
  "motion-safe:[&_button[aria-haspopup=dialog]]:relative motion-safe:[&_button[aria-haspopup=dialog]]:isolate motion-safe:[&_button[aria-haspopup=dialog]]:overflow-hidden",
  "motion-safe:[&_button[aria-haspopup=dialog]::after]:content-[''] motion-safe:[&_button[aria-haspopup=dialog]::after]:absolute motion-safe:[&_button[aria-haspopup=dialog]::after]:inset-0 motion-safe:[&_button[aria-haspopup=dialog]::after]:pointer-events-none motion-safe:[&_button[aria-haspopup=dialog]::after]:bg-[linear-gradient(110deg,transparent_25%,#ffffff20_50%,transparent_75%)] motion-safe:[&_button[aria-haspopup=dialog]::after]:-translate-x-[130%] motion-safe:[&_button[aria-haspopup=dialog]::after]:transition-transform motion-safe:[&_button[aria-haspopup=dialog]::after]:duration-[650ms] motion-safe:[&_button[aria-haspopup=dialog]:hover::after]:translate-x-[130%]",
].join(" ");

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "A Brighter Future Begins at DGS | Doon Global School",
  description: "Discover Doon Global School, Dehradun. CBSE boys’ boarding for Classes 3–12, for families in Siliguri, North Bengal and North East India. Enquire for 2027–28.",
  openGraph: {
    title: "From Siliguri to a bigger tomorrow | Doon Global School",
    description: "A place to learn, belong and become. Explore boarding admissions for 2027–28.",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/images/hero-campus.png", width: 1672, height: 941, alt: "Illustrative Doon Global School campus admissions campaign" }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/images/logo.webp" },
};

export const viewport: Viewport = { themeColor: "#073c32", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${serif.variable} scroll-smooth scroll-pt-32 max-[760px]:scroll-pt-[110px] motion-reduce:scroll-auto [&.lenis-smooth]:scroll-auto! [&.lenis-stopped]:overflow-clip [&.lenis-smooth_[data-lenis-prevent]]:overscroll-contain`}><body className={baseClasses}>{children}</body></html>;
}
