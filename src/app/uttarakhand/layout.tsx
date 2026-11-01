import localFont from "next/font/local";

const devanagari = localFont({
  src: "../../../public/fonts/noto-sans-devanagari.ttf",
  variable: "--font-devanagari",
  weight: "100 900",
  display: "swap",
});

export default function UttarakhandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${devanagari.variable} contents [&_[lang=hi]]:[font-family:var(--font-devanagari),sans-serif] [&_[lang=gbm]]:[font-family:var(--font-devanagari),sans-serif] [&_[lang=hi]]:tracking-normal [&_[lang=gbm]]:tracking-normal [&_[lang=hi]]:leading-[1.85] [&_[lang=gbm]]:leading-[1.85]`}>
      {children}
    </div>
  );
}
