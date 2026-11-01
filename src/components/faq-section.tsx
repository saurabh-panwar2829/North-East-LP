"use client";

import { getRegionalCopy, type RegionalCopy } from "@/lib/regional-copy";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, MessageCircle, Phone, Plus } from "lucide-react";
import { useCampaign } from "@/components/campaign-context";
import { campaignCityLabel } from "@/lib/campaigns";

function getQuestions(cityLabel: string, copy: RegionalCopy | undefined) { return [
  {
    question: copy ? copy.faqQuestions[0] : "Which cities are covered by the admission drive?",
    answer: copy ? copy.faqTowns : `The admissions team is meeting families from ${cityLabel} for the 2027–28 session. Register for your city and the team will confirm the venue, date and time, and walk you through the application, assessment and documents for your child’s class.`,
  },
  {
    question: copy ? copy.faqQuestions[1] : "Which classes are eligible for boarding?",
    answer: copy ? copy.faqBoarding : "Boarding is for boys from Grade 3 to Class XII. The co-educational day school admits children from Nursery to Class XII, so younger children join as day scholars. The school is affiliated to CBSE, New Delhi (Affiliation No. 3530108), and Classes XI–XII offer Science with Mathematics, Science with Biology, Commerce and Humanities.",
  },
  {
    question: copy ? copy.faqQuestions[2] : "What does the boarding fee cover?",
    answer: copy ? copy.faqFees : "For 2027–28 the term fee covers boarding, lodging and tuition: ₹1,50,000 per term for Grades 3–8, ₹1,55,000 for Grades 9–10, and ₹1,60,000 and ₹1,65,000 for the two terms of Grades 11–12. One-time charges of ₹90,000 apply at admission, including a ₹20,000 refundable security deposit. Basic in-house medical care is included; books, uniform, transport and personal expenses are not.",
  },
  {
    question: copy ? copy.faqQuestions[3] : "Are uniforms, books and school essentials available?",
    answer: copy ? copy.faqEssentials : "Yes. Books, uniform, stationery, laundry, excursions and CBSE fees for boarders are billed through an imprest account on actual usage, estimated at ₹35,000 a year, with a minimum balance of ₹5,000 to be maintained. The school shares written instructions on the uniform and packing list after admission, so please wait for those before buying anything.",
  },
  {
    question: copy ? copy.faqQuestions[4] : "Are all activities and partner programmes included?",
    answer: copy ? copy.faqProgrammes : "Sports include cricket, football, basketball and athletics, alongside music, dance, art, debate and MUN, robotics, theatre, NCC and NSS. Partner programmes such as Bengaluru FC Soccer Schools, Kidnasium, Prayaas mock boards and Centurion Defence Academy run through the school. Options and schedules change by class and term, and some programmes may be charged separately, so ask admissions what applies to your child.",
  },
  {
    question: copy ? copy.faqQuestions[5] : "How can we visit the campus or begin admissions?",
    answer: copy ? copy.faqAdmissions : "Admission takes six steps: enquiry and registration, submission of documents, an entrance assessment for Grade I and above (about an hour, covering English, Mathematics, Science or EVS, and reasoning), an interaction with the Principal, fee payment with an offer letter, and orientation before the year begins. Call +91 74559 97333 or email admissions@doonglobalschool.edu.in to plan a campus visit at Chakrata Road, Jhajra, Dehradun.",
  },
];
}

export default function FaqSection({ onEnquire }: { onEnquire: () => void }) {
  const campaign = useCampaign();
  const copy = getRegionalCopy(campaign.id);
  const questions = getQuestions(campaignCityLabel(campaign), copy);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const questionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function navigateQuestions(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowDown": next = (index + 1) % questions.length; break;
      case "ArrowUp": next = (index - 1 + questions.length) % questions.length; break;
      case "Home": next = 0; break;
      case "End": next = questions.length - 1; break;
      default: return;
    }
    event.preventDefault();
    questionRefs.current[next]?.focus();
  }

  return (
    <section id="faqs" aria-labelledby="faq-heading" className="relative overflow-hidden bg-ivory py-20 max-[900px]:py-16 max-[600px]:py-12">
      <div className="mx-auto w-[calc(100%-128px)] max-w-[1280px] max-[1150px]:w-[calc(100%-80px)] max-[900px]:w-[calc(100%-56px)] max-[760px]:w-[calc(100%-40px)] max-[370px]:w-[calc(100%-32px)]">
        <div className="mb-9 flex items-end justify-between gap-12 max-[760px]:mb-7 max-[760px]:block" data-reveal>
          <div>
            <p className="mb-4 flex items-center gap-2.5 text-[13px] font-semibold tracking-[1.8px] text-[#5f6c50] max-[600px]:text-[12px]">
              <span className="h-px w-6 bg-[#b3945e]" aria-hidden="true" />
              A LITTLE CLARITY, A LITTLE CONFIDENCE
            </p>
            <h2 id="faq-heading" className="text-[clamp(38px,3.7vw,52px)] leading-[1.06] tracking-[-1.5px] text-green max-[600px]:text-[39px] max-[370px]:text-[36px]">
              Good questions.<br /><em className="text-[#687552]">Clearer beginnings.</em>
            </h2>
          </div>
          <p lang={copy ? "hi" : undefined} className="max-w-[310px] pb-1 text-[16px] leading-[1.85] text-[#606c58] max-[760px]:mt-5 max-[760px]:max-w-[440px] max-[760px]:pb-0">
            {copy ? copy.faqIntro : "A new school is a big step for the whole family. Here are a few answers to help you feel ready for what comes next."}
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-8 max-[1150px]:grid-cols-[minmax(0,1fr)_300px] max-[1150px]:gap-6 max-[900px]:grid-cols-1">
          <div className="space-y-2.5" data-reveal>
            {questions.map((item, index) => {
              const isOpen = openQuestion === index;

              return (
                <div
                  key={item.question}
                  data-open={isOpen}
                  className="group rounded-lg border border-[#e0e3d5] bg-[#f5f5ec] transition-[background-color,border-color,box-shadow] duration-300 hover:border-[#bac6aa] data-[open=true]:border-[#b8c4a5] data-[open=true]:bg-[#fffef9] data-[open=true]:shadow-[0_8px_30px_#21452d08]"
                >
                  <h3>
                    <button
                      ref={element => { questionRefs.current[index] = element; }}
                      type="button"
                      id={`question-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`answer-${index}`}
                      onClick={() => setOpenQuestion(isOpen ? null : index)}
                      onKeyDown={event => navigateQuestions(event, index)}
                      className="flex min-h-[72px] w-full items-center gap-5 rounded-lg px-6 py-4 text-left focus-visible:outline-offset-4 max-[600px]:gap-3 max-[600px]:px-4 max-[600px]:py-4"
                    >
                      <span aria-hidden="true" className="w-7 shrink-0 font-serif text-[23px] leading-none text-[#616c51] transition-colors group-data-[open=true]:text-[#7c6539] max-[600px]:w-5 max-[600px]:text-[20px]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span lang={copy ? "hi" : undefined} className="flex-1 text-[17px] font-medium leading-[1.6] text-[#3e5545] group-data-[open=true]:text-green max-[600px]:text-[16px]">
                        {item.question}
                      </span>
                      <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full border border-[#d6ddc9] text-[#5d6c4c] transition-[background-color,border-color,color] duration-300 group-data-[open=true]:border-green group-data-[open=true]:bg-green group-data-[open=true]:text-[#ecd3a1] max-[600px]:size-7">
                        <Plus size={15} strokeWidth={1.5} className="transition-transform duration-300 group-data-[open=true]:rotate-45" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`answer-${index}`}
                    role="region"
                    aria-labelledby={`question-${index}`}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                    className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-data-[open=true]:grid-rows-[1fr] group-data-[open=true]:opacity-100"
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="mr-[76px] ml-[72px] border-t border-[#e7e8db] pt-3 pb-5 max-[600px]:mr-4 max-[600px]:ml-12">
                        <p lang={copy ? "hi" : undefined} className="text-[16px] leading-[1.9] text-[#5f6b56] max-[600px]:text-[15px] [overflow-wrap:anywhere]">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside aria-label="Personal admissions guidance" className="relative isolate overflow-hidden rounded-xl bg-green p-8 text-[#fffbed] max-[1150px]:p-7 max-[900px]:grid max-[900px]:grid-cols-[1fr_1fr] max-[900px]:gap-8 max-[600px]:block max-[600px]:p-6" data-reveal data-reveal-delay="1">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 -z-10 size-72 rounded-full border border-[#dac68f1a] shadow-[0_0_0_32px_#dac68f05,0_0_0_64px_#dac68f03]" />
            <div>
              <span className="mb-6 grid size-12 place-items-center rounded-full border border-[#dcc79340] bg-[#ffffff05] text-[#e5cc96] max-[600px]:mb-5"><MessageCircle size={23} strokeWidth={1.2} aria-hidden="true" /></span>
              <p className="mb-3 text-[12px] font-medium tracking-[1.6px] text-[#c6caa8]">SOME ANSWERS ARE PERSONAL.</p>
              <h3 className="font-serif text-[34px] leading-[1.08] tracking-[-.7px] max-[600px]:text-[32px]">Still have<br /><em className="text-[#e4cb94]">a question?</em></h3>
              <p lang={copy?.familyLanguage} className="mt-4 text-[15px] leading-[1.85] text-[#c0cfb9]">{copy ? copy.personal : "Every child’s journey is different. Let’s talk through what matters to your family."}</p>
            </div>
            <div className="mt-6 max-[900px]:self-center max-[900px]:mt-0 max-[600px]:mt-6">
              <button type="button" onClick={onEnquire} aria-haspopup="dialog" className="flex min-h-12 w-full items-center justify-between gap-3 rounded border border-[#e4c68d] bg-[#ecd2a0] px-4 py-3 text-left text-[15px] font-semibold text-[#173c2d] transition-colors hover:bg-[#f6dfb3]">
                Ask our admissions team <ArrowUpRight size={17} aria-hidden="true" />
              </button>
              <a href="tel:+917455997333" className="mt-5 flex items-center gap-3 rounded-sm py-1 text-[#ead6ab] transition-colors hover:text-white">
                <Phone size={16} strokeWidth={1.4} aria-hidden="true" />
                <span><span className="block text-[12px] tracking-[.5px] text-[#afc3a8]">OR CALL US DIRECTLY</span><span className="mt-1 block font-serif text-[23px] leading-[1.3]">+91 74559 97333</span></span>
              </a>
              <p className="mt-6 border-t border-[#d6c28b26] pt-4 text-[13px] leading-[1.7] text-[#afc3a8]">For families across {campaign.audience}.<br /><span className="text-[#d8d0ad]">Boys’ boarding · Classes 3–12</span></p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
