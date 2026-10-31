"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowRight, CalendarDays, CheckCircle2, ChevronDown, GraduationCap, LoaderCircle, LockKeyhole, Mail, MapPin, Phone, User } from "lucide-react";
import { CLASS_OPTIONS, DRIVE_CITIES, INTERESTS, REGIONS, validateEnquiry, type Enquiry } from "@/lib/enquiry";
import type { EnquiryPreset } from "@/components/admission-drive";

// Static Tailwind utility groups keep the markup and responsive states readable.
const ui: Record<string, string> = {
  card: "dgs-admissions-form-card grid grid-cols-[minmax(0,_.78fr)_minmax(0,_1.22fr)] bg-[#fbfaf4] text-[#173f33] max-[850px]:grid-cols-[minmax(0,_.72fr)_minmax(0,_1.28fr)] max-[700px]:block",
  aside: "dgs-admissions-form-aside relative min-w-0 isolate overflow-hidden bg-[#073c32] text-[#fff9e9]",
  asidePhoto: "dgs-admissions-form-asidePhoto absolute top-[38%] right-0 bottom-0 left-0 -z-2 [&_img]:object-cover [&_img]:[object-position:51%_35%] max-[700px]:top-0 max-[700px]:right-0 max-[700px]:bottom-0 max-[700px]:left-[36%] max-[700px]:[&_img]:[object-position:center_28%]",
  shade: "dgs-admissions-form-shade absolute top-0 right-0 bottom-0 left-0 -z-1 [background:linear-gradient(180deg,_#073c32_0%,_#073c32_38%,_#073c32d9_48%,_#073c3212_68%,_#052c25d9_100%)] max-[700px]:[background:linear-gradient(90deg,_#073c32_30%,_#073c32e6_53%,_#073c3266_100%)]",
  asideContent: "dgs-admissions-form-asideContent flex flex-col relative min-h-full pt-[31px] pr-7 pb-[27px] pl-7 max-[850px]:pl-[23px] max-[850px]:pr-[23px] max-[700px]:flex-row max-[700px]:gap-[19px] max-[700px]:items-center max-[700px]:min-h-28 max-[700px]:pt-5 max-[700px]:pr-6 max-[700px]:pb-5 max-[700px]:pl-6 max-[370px]:pl-5 max-[370px]:pr-5 max-[370px]:gap-[15px]",
  logo: "dgs-admissions-form-logo w-24.5 h-18 object-contain max-[700px]:w-[77px] max-[700px]:h-[57px] max-[700px]:flex-none",
  asideHeading: "dgs-admissions-form-asideHeading mt-[33px] [&_h3]:mt-[17px] [&_h3]:font-serif [&_h3]:text-[34px] [&_h3]:leading-[1.08] [&_h3]:tracking-[-.8px] [&_h3_em]:text-[#e6cd95] max-[850px]:[&_h3]:text-[30px] max-[700px]:mt-0 max-[700px]:mr-0 max-[700px]:mb-0 max-[700px]:ml-0 max-[700px]:[&_h3]:mt-0 max-[700px]:[&_h3]:mr-0 max-[700px]:[&_h3]:mb-0 max-[700px]:[&_h3]:ml-0 max-[700px]:[&_h3]:text-[22px] max-[700px]:[&_h3]:leading-[1.12] max-[700px]:[&_h3]:tracking-[-.4px] max-[370px]:[&_h3]:text-[21px]",
  asideEyebrow: "dgs-admissions-form-asideEyebrow text-[11px] tracking-[1.4px] text-[#d7c392] leading-[1.9] max-[850px]:text-[11px] max-[850px]:tracking-[1.1px] max-[700px]:hidden",
  asideIntro: "dgs-admissions-form-asideIntro mt-[17px] text-[#c4d1bf] text-[14px] leading-[1.8] max-[700px]:hidden",
  asideFoot: "dgs-admissions-form-asideFoot mt-auto pt-[180px] [&_>_span]:flex [&_>_span]:items-center [&_>_span]:gap-1.5 [&_>_span]:text-[11px] [&_>_span]:tracking-[1.1px] [&_>_span]:text-[#ece5cb] [&_>_a]:flex [&_>_a]:items-center [&_>_a]:gap-[9px] [&_>_a]:w-fit [&_>_a]:mt-[13px] [&_>_a]:text-[#fff4d7] [&_>_a]:text-[17px] [&_>_a]:font-medium [&_>_a_svg:last-child]:ml-1.5 [&_svg]:stroke-[1.4] max-[700px]:hidden",
  panel: "dgs-admissions-form-panel flex flex-col pt-8 pr-[35px] pb-0 pl-[35px] min-w-0 max-[850px]:pl-[27px] max-[850px]:pr-[27px] max-[700px]:pt-[25px] max-[700px]:pr-6 max-[700px]:pb-0 max-[700px]:pl-6 max-[370px]:pl-5 max-[370px]:pr-5",
  header: "dgs-admissions-form-header mb-[25px] pr-2.5 [&_h2]:text-[36px] [&_h2]:leading-[1.04] [&_h2]:tracking-[-1px] [&_h2_em]:text-[#687454] max-[700px]:mb-[23px] max-[700px]:pt-0 max-[700px]:pr-0 max-[700px]:pb-0 max-[700px]:pl-0 max-[700px]:[&_h2]:text-[34px] max-[370px]:[&_h2]:text-[32px]",
  kicker: "dgs-admissions-form-kicker flex items-center gap-[7px] mb-3.5 text-[12px] font-semibold tracking-[1.25px] text-[#606d4a] [&_>_span]:w-[5px] [&_>_span]:h-[5px] [&_>_span]:bg-[#6a874d] [&_>_span]:rounded-full [&_>_span]:shadow-[0_0_0_3px_#6a874d13] [&_>_span]:flex-none max-[700px]:text-[11px] max-[700px]:tracking-[1.2px] max-[700px]:mb-[13px]",
  introduction: "dgs-admissions-form-introduction mt-[13px] text-[15px] text-[#646a5c] leading-[1.7] max-[700px]:text-[14px] max-[700px]:max-w-[285px] max-[700px]:mt-[11px]",
  field: "dgs-admissions-form-field min-w-0 mb-[17px] [&_>_label]:block [&_>_label]:mb-2 [&_>_label]:text-[14px] [&_>_label]:font-semibold [&_>_label]:text-[#3d5544] [&_>_label_>_span]:text-[#7f6334] [&_>_label_>_span]:ml-0.5 max-[700px]:mb-4 max-[700px]:[&_>_label]:text-[14px]",
  interests: "dgs-admissions-form-interests [&_legend]:block [&_legend]:mb-[9px] [&_legend]:text-[14px] [&_legend]:font-semibold [&_legend]:text-[#3d5544] [&_legend]:pt-0 [&_legend]:pr-0 [&_legend]:pb-0 [&_legend]:pl-0 [border:0] pt-0 pr-0 pb-0 pl-0 mt-[3px] mr-0 mb-4.5 ml-0 min-w-0 [&_>_div]:grid [&_>_div]:grid-cols-[1fr_1.15fr_.75fr] [&_>_div]:gap-2 [&_label]:flex [&_label]:items-center [&_label]:justify-center [&_label]:gap-[7px] [&_label]:min-h-[41px] [&_label]:[border:1px_solid_#dce0d1] [&_label]:rounded-[4px] [&_label]:bg-[#fffefa] [&_label]:text-[#5f6d55] [&_label]:cursor-pointer [&_label]:text-[14px] [&_label]:font-medium [&_label]:[transition:background_.2s,_border-color_.2s,_color_.2s] [&_label:hover]:[border-color:#92a77e] [&_label:has(:checked)]:bg-[#eaf0e1] [&_label:has(:checked)]:[border-color:#91a77c] [&_label:has(:checked)]:text-[#294e38] [&_input]:appearance-none [&_input]:w-3 [&_input]:h-3 [&_input]:mt-0 [&_input]:mr-0 [&_input]:mb-0 [&_input]:ml-0 [&_input]:flex-none [&_input]:[border:1px_solid_#a5b296] [&_input]:rounded-full [&_input]:bg-[transparent] [&_input:checked]:bg-[#54764b] [&_input:checked]:[border-color:#54764b] [&_input:checked]:shadow-[inset_0_0_0_3px_#f5f9ef] max-[700px]:[&_legend]:text-[14px] max-[700px]:[&_>_div]:gap-[7px] max-[700px]:[&_label]:min-h-[41px] max-[700px]:[&_label]:text-[14px] max-[700px]:[&_label]:gap-1.5 max-[370px]:[&_label]:text-[13px] max-[370px]:[&_label]:gap-[5px] motion-reduce:[&_label]:transition-none",
  input: "dgs-admissions-form-input relative flex items-center gap-2.5 h-11.5 pl-3 pr-3 [border:1px_solid_#dce0d1] rounded-[5px] bg-[#fffefa] [transition:border-color_.2s,_box-shadow_.2s,_background_.2s] [&:hover]:[border-color:#afbea1] [&:focus-within]:[border-color:#789264] [&:focus-within]:bg-[#fff] [&:focus-within]:shadow-[0_0_0_3px_#6e885111] [&:has([aria-invalid=true])]:[border-color:#bc7662] [&:has([aria-invalid=true])]:bg-[#fffaf5] [&_>_svg]:w-[15px] [&_>_svg]:h-[15px] [&_>_svg]:flex-none [&_>_svg]:text-[#7c8b6a] [&_>_svg]:stroke-[1.3] [&:focus-within_>_svg]:text-[#557849] [&_input]:w-full [&_input]:min-w-0 [&_input]:h-full [&_input]:[border:0] [&_input]:rounded-[0] [&_input]:[outline:none]! [&_input]:bg-[transparent] [&_input]:text-[#2b4b3b] [&_input]:text-[16px] [&_select]:w-full [&_select]:min-w-0 [&_select]:h-full [&_select]:[border:0] [&_select]:rounded-[0] [&_select]:[outline:none]! [&_select]:bg-[transparent] [&_select]:text-[#2b4b3b] [&_select]:text-[15px] [&_select]:appearance-none [&_select]:pr-3.5 [&_select]:cursor-pointer [&_input::placeholder]:text-[#64695c] [&_.dgs-admissions-form-chevron]:absolute [&_.dgs-admissions-form-chevron]:right-2.5 [&_.dgs-admissions-form-chevron]:w-3 [&_.dgs-admissions-form-chevron]:h-3 [&_.dgs-admissions-form-chevron]:pointer-events-none max-[700px]:h-11.5 max-[700px]:gap-2 max-[700px]:pl-[11px] max-[700px]:pr-[11px] max-[700px]:[&_input]:text-[16px] max-[700px]:[&_select]:text-[16px] max-[700px]:[&_select]:pr-3 max-[700px]:[&_input::placeholder]:text-[16px] motion-reduce:transition-none",
  prefix: "dgs-admissions-form-prefix [border-right:1px_solid_#dce1d2] pr-[9px] text-[15px] text-[#5e7355]",
  row: "dgs-admissions-form-row grid grid-cols-[minmax(0,_.85fr)_minmax(0,_1.15fr)] gap-[13px] max-[700px]:grid-cols-[minmax(0,_.9fr)_minmax(0,_1.1fr)] max-[700px]:gap-2.5 max-[700px]:[&_.dgs-admissions-form-input]:gap-1.5 max-[700px]:[&_.dgs-admissions-form-input_>_svg:not(.dgs-admissions-form-chevron)]:hidden",
  consent: "dgs-admissions-form-consent flex items-start gap-[9px] mt-[19px] mr-0 mb-[5px] ml-0 [&_>_input]:w-3.5 [&_>_input]:h-3.5 [&_>_input]:mt-[1px] [&_>_input]:mr-0 [&_>_input]:mb-0 [&_>_input]:ml-0 [&_>_input]:[accent-color:#365f42] [&_>_input]:flex-none [&_div]:text-[#646b5b] [&_div]:text-[13px] [&_div]:leading-[1.75] [&_label]:cursor-pointer [&_button]:[border:0] [&_button]:pt-0 [&_button]:pr-0 [&_button]:pb-0 [&_button]:pl-0 [&_button]:bg-[transparent] [&_button]:text-[#547047] [&_button]:[font:inherit] [&_button]:[text-underline-offset:2px] [&_button]:underline max-[700px]:[&_div]:text-[13px] max-[700px]:mt-4.5",
  submit: "dgs-admissions-form-submit flex items-center justify-between gap-4.5 w-full min-h-12 mt-5 pt-[13px] pr-[17px] pb-[13px] pl-[17px] [border:1px_solid_#073c32] rounded-[5px] bg-[#073c32] text-[#fffbed] text-[16px] font-semibold shadow-[0_4px_12px_#0b372414] [transition:background_.25s,_box-shadow_.25s] [&:hover:not(:disabled)]:bg-[#19543d] [&:hover:not(:disabled)]:shadow-[0_5px_16px_#0b372420] [&_>_svg]:flex-none [&_>_svg]:text-[#e8cd93] max-[700px]:min-h-12 max-[700px]:mt-[19px] motion-reduce:transition-none",
  privacy: "dgs-admissions-form-privacy flex items-center justify-center gap-1.5 pt-[13px] pb-[19px] text-[12px] text-[#626a5a] leading-[1.5] [&_svg]:flex-none [&_svg]:stroke-[1.4] max-[700px]:text-[11px] max-[700px]:pb-4.5",
  foot: "dgs-admissions-form-foot flex items-center justify-center gap-[9px] mt-auto ml-[-35px] mr-[-35px] pt-3.5 pr-4.5 pb-3.5 pl-4.5 bg-[#f0f1e7] [border-top:1px_solid_#e0e3d5] text-[#5f6b51] text-[13px] [&_>_svg]:text-[#798c64] [&_>_svg]:stroke-[1.3] [&_>_svg]:mr-0.5 [&_>_i]:w-0.5 [&_>_i]:h-0.5 [&_>_i]:rounded-full [&_>_i]:bg-[#a8b58f] max-[850px]:ml-[-27px] max-[850px]:mr-[-27px] max-[700px]:-ml-6 max-[700px]:-mr-6 max-[700px]:gap-[7px] max-[700px]:text-[12px] max-[700px]:pt-[13px] max-[700px]:pb-[13px] max-[700px]:[&_svg]:w-[15px] max-[370px]:-ml-5 max-[370px]:-mr-5",
  error: "dgs-admissions-form-error block text-[#a54d34] text-[13px] leading-[1.6] mt-1.5",
  formError: "dgs-admissions-form-formError mt-3.5 [border-left:2px_solid_#b97458] rounded-[3px] pt-[11px] pr-3 pb-[11px] pl-3 bg-[#f6eae0] text-[#9a4b34] text-[15px] leading-[1.7]",
  honeypot: "dgs-admissions-form-honeypot absolute left-[-10000px] opacity-0 h-0 w-0 overflow-hidden",
  result: "dgs-admissions-form-result flex flex-col items-center text-center min-h-[360px] pt-[25px] pr-[5px] pb-[35px] pl-[5px] outline-offset-[3px] [&_h3]:mt-2.5 [&_h3]:font-serif [&_h3]:text-[31px] [&_h3]:leading-[1.1] [&_h3]:tracking-[-.7px] [&_>_p]:mt-4 [&_>_p]:max-w-[325px] [&_>_p]:text-[#626b59] [&_>_p]:text-[16px] [&_>_p]:leading-[1.85] [&_.dgs-admissions-form-submit]:mt-[25px] [&_.dgs-admissions-form-submit]:max-w-[320px] max-[700px]:min-h-0 max-[700px]:pt-4.5 max-[700px]:pr-0 max-[700px]:pb-7.5 max-[700px]:pl-0 max-[700px]:[&_h3]:text-[29px] max-[700px]:[&_>_p]:text-[15px]",
  resultIcon: "dgs-admissions-form-resultIcon w-[65px] h-[65px] grid place-items-center [border:1px_solid_#c9d6b9] rounded-full bg-[#edf2e4] text-[#556f44] shadow-[0_0_0_8px_#edf2e455] [&_svg]:stroke-[1.2]",
  resultLabel: "dgs-admissions-form-resultLabel mt-6.5 text-[#606c4c] text-[12px] tracking-[1.3px] font-semibold",
  resultPhone: "dgs-admissions-form-resultPhone flex items-center gap-2 mt-5.5 text-[17px] font-medium text-[#48643c]",
  back: "dgs-admissions-form-back [border:0] [border-bottom:1px_solid_#a9b697] pt-0 pr-0 pb-[3px] pl-0 bg-[transparent] text-[#616b55] text-[14px] mt-5",
  spinner: "dgs-admissions-form-spinner animate-spin",
  chevron: "dgs-admissions-form-chevron",
};


export default function AdmissionsForm({ onPrivacy, preset = null }: { onPrivacy: () => void; preset?: EnquiryPreset | null }) {
  const [region, setRegion] = useState(preset?.region ?? "Siliguri");
  const [drive, setDrive] = useState<string>(preset?.drive ?? "");
  const [appliedPreset, setAppliedPreset] = useState(preset);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // A drive card opened the form: preselect its city without clearing anything already typed.
  if (preset !== appliedPreset) {
    setAppliedPreset(preset);
    if (preset) { setRegion(preset.region); setDrive(preset.drive); }
  }
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ delivery: string; emailUrl?: string } | null>(null);
  const [draft, setDraft] = useState<Enquiry | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    const payload = { ...Object.fromEntries(fields), consent: fields.get("consent") === "on" };
    const validation = validateEnquiry(payload);
    setErrors(validation.errors);
    if (!validation.data) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(validation.errors)[0]}"]`)?.focus();
      return;
    }
    setDraft(validation.data);
    setBusy(true);
    try {
      const response = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(validation.data) });
      const body = await response.json();
      if (!response.ok) { setErrors(body.errors || { form: body.error || "Please try again or call admissions." }); return; }
      setResult(body);
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch { setErrors({ form: "Unable to connect. Your details are still here. Please try again or call admissions." }); }
    finally { setBusy(false); }
  }

  function clearError(name: string) {
    setErrors(previous => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  }

  const error = (name: string) => errors[name] ? <span id={`${name}-error`} className={ui.error}>{errors[name]}</span> : null;

  return (
    <div className={ui.card} id="enquire">
      <aside className={ui.aside} aria-label="Doon Global School admissions">
        <div className={ui.asidePhoto}><Image src="/images/life-at-dgs/academics.webp" alt="Illustrative North East Indian student studying in a school library" fill sizes="(max-width: 700px) 400px, 750px" /></div>
        <div className={ui.shade} />
        <div className={ui.asideContent}>
          <Image className={ui.logo} src="/images/logo-white.webp" alt="Doon Global School" width={105} height={77} />
          <div className={ui.asideHeading}>
            <p className={ui.asideEyebrow}>FROM NORTH EAST INDIA.<br />TOWARDS NEW POSSIBILITIES.</p>
            <h3>A bigger world.<br /><em>A brighter future.</em></h3>
            <p className={ui.asideIntro}>A new chapter in Dehradun.<br />A place to learn, belong and grow.</p>
          </div>
          <div className={ui.asideFoot}><span><MapPin size={12} aria-hidden="true" /> DEHRADUN, UTTARAKHAND</span><a href="tel:+917455997333"><Phone size={14} aria-hidden="true" /> +91 74559 97333 <ArrowRight size={14} aria-hidden="true" /></a></div>
        </div>
      </aside>

      <div className={ui.panel}>
        <div className={ui.header}>
          <p className={ui.kicker}><span aria-hidden="true" /> ADMISSIONS OPEN 2027–28</p>
          <h2>Let’s start with<br /><em>a conversation.</em></h2>
          <p className={ui.introduction}>A few details today. A world of possibilities tomorrow.</p>
        </div>

        {result ? (
          <div className={ui.result} tabIndex={-1} ref={resultRef} role="status">
            <span className={ui.resultIcon}>{result.delivery === "sent" ? <CheckCircle2 size={29} /> : <Mail size={29} />}</span>
            <span className={ui.resultLabel}>{result.delivery === "sent" ? "REQUEST RECEIVED" : "ONE LAST STEP"}</span>
            <h3>{result.delivery === "sent" ? "Your journey starts here." : "Your enquiry is ready."}</h3>
            <p>{result.delivery === "sent" ? "Your callback request has been delivered to the admissions team. We look forward to speaking with you." : "Open your email app to review and send your details to admissions. Your enquiry has not been sent yet."}</p>
            {result.emailUrl && <a className={ui.submit} href={result.emailUrl}>Open email & send <ArrowRight size={18} aria-hidden="true" /></a>}
            <a className={ui.resultPhone} href="tel:+917455997333"><Phone size={15} aria-hidden="true" /> +91 74559 97333</a>
            <button className={ui.back} onClick={() => setResult(null)}>Back to enquiry form</button>
          </div>
        ) : (
          <form noValidate ref={formRef} onSubmit={submit} aria-busy={busy} onChange={event => { if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) clearError(event.target.name); }}>
            <div className={ui.field}>
              <label htmlFor="parent-name">Parent / guardian’s name <span>*</span></label>
              <div className={ui.input}><User aria-hidden="true" /><input id="parent-name" name="name" defaultValue={draft?.name ?? ""} autoComplete="name" placeholder="Your full name" maxLength={80} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} /></div>
              {error("name")}
            </div>
            <div className={ui.field}>
              <label htmlFor="mobile">Mobile number <span>*</span></label>
              <div className={ui.input}><Phone aria-hidden="true" /><span className={ui.prefix}>+91</span><input id="mobile" name="phone" defaultValue={draft?.phone ?? ""} type="tel" autoComplete="tel-national" inputMode="tel" placeholder="10-digit mobile number" maxLength={18} required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} /></div>
              {error("phone")}
            </div>
            <div className={ui.row}>
              <div className={ui.field}>
                <label htmlFor="grade">Child’s class <span>*</span></label>
                <div className={ui.input}><GraduationCap aria-hidden="true" /><select id="grade" name="grade" defaultValue={draft?.grade ?? ""} required aria-invalid={!!errors.grade} aria-describedby={errors.grade ? "grade-error" : undefined}><option value="" disabled>Select class</option>{CLASS_OPTIONS.map(grade => <option key={grade} value={grade}>Class {grade}</option>)}</select><ChevronDown className={ui.chevron} aria-hidden="true" /></div>
                {error("grade")}
              </div>
              <div className={ui.field}>
                <label htmlFor="region">City <span>*</span></label>
                <div className={ui.input}><MapPin aria-hidden="true" /><select id="region" name="region" value={region} onChange={event => setRegion(event.target.value)} required aria-invalid={!!errors.region} aria-describedby={errors.region ? "region-error" : undefined}>{REGIONS.map(city => <option key={city}>{city}</option>)}</select><ChevronDown className={ui.chevron} aria-hidden="true" /></div>
                {error("region")}
              </div>
            </div>
            <div className={ui.field}>
              <label htmlFor="drive">North East admission drive</label>
              <div className={ui.input}><CalendarDays aria-hidden="true" /><select id="drive" name="drive" value={drive} onChange={event => setDrive(event.target.value)} aria-invalid={!!errors.drive} aria-describedby={errors.drive ? "drive-error" : undefined}><option value="">Not now — just a callback</option>{DRIVE_CITIES.map(city => <option key={city} value={city}>Register for {city}</option>)}</select><ChevronDown className={ui.chevron} aria-hidden="true" /></div>
              {error("drive")}
            </div>
            <fieldset className={ui.interests} aria-invalid={!!errors.interest} aria-describedby={errors.interest ? "interest-error" : undefined}>
              <legend>I’m interested in</legend>
              <div>{INTERESTS.map((interest, index) => <label key={interest}><input type="radio" name="interest" value={interest} defaultChecked={draft ? draft.interest === interest : index === 0} /><span>{index === 1 ? "Programmes" : index === 0 ? "Boarding" : "Both"}</span></label>)}</div>
              {error("interest")}
            </fieldset>
            <div className={ui.consent}>
              <input id="enquiry-consent" type="checkbox" name="consent" defaultChecked={draft?.consent ?? false} required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : undefined} />
              <div><label htmlFor="enquiry-consent">I agree to be contacted about my enquiry.</label>{" "}<button type="button" onClick={onPrivacy}>Privacy details</button></div>
            </div>
            {error("consent")}
            <div className={ui.honeypot} aria-hidden="true"><label htmlFor="website">Leave this empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
            {errors.form && <p className={ui.formError} role="alert">{errors.form}</p>}
            <button className={ui.submit} type="submit" disabled={busy}>{busy ? <>Preparing your enquiry <LoaderCircle className={ui.spinner} size={18} aria-hidden="true" /></> : <>{drive ? `Register for ${drive}` : "Request a callback"} <ArrowRight size={18} aria-hidden="true" /></>}</button>
            <p className={ui.privacy}><LockKeyhole size={12} aria-hidden="true" /> Your details are used to respond to your enquiry.</p>
          </form>
        )}
        <div className={ui.foot}><GraduationCap size={16} aria-hidden="true" /><span>Boys’ boarding</span><i /> Classes 3–12 <i /> CBSE</div>
      </div>
    </div>
  );
}
