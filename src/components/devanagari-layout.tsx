import localFont from "next/font/local";

const devanagari = localFont({
  src: [
    { path: "../../public/fonts/kalam-regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/kalam-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-devanagari",
  display: "swap",
});

export default function DevanagariLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${devanagari.variable} contents [&_[lang=hi]]:[font-family:var(--font-devanagari),sans-serif] [&_[lang=gbm]]:[font-family:var(--font-devanagari),sans-serif] [&_[lang=hi]]:tracking-normal [&_[lang=gbm]]:tracking-normal [&_[lang=hi]]:leading-[1.85] [&_[lang=gbm]]:leading-[1.85]`}>
      {children}
    </div>
  );
}
