import { getCampaign, type CampaignId } from "./campaigns.ts";

export const CLASS_OPTIONS = Array.from({ length: 10 }, (_, index) => String(index + 3));
export const INTERESTS = ["Boarding admissions", "Activities & programmes", "Both"];

export type Enquiry = { campaign?: CampaignId; name: string; phone: string; grade: string; region: string; city: string; interest: string; drive: string; consent: boolean; website: string };

export function validateEnquiry(input: unknown): { data?: Enquiry; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return { errors: { form: "Please complete the enquiry form." } };
  const value = input as Record<string, unknown>;
  const read = (key: string) => typeof value[key] === "string" ? value[key].trim() : "";
  // Accept old North East clients without a campaign, but reject invalid explicit IDs.
  const campaign = getCampaign(value.campaign === undefined ? "north-east" : read("campaign"));
  if (!campaign) errors.campaign = "Please choose a valid admissions campaign.";
  const towns = campaign?.homeGroups.flatMap(group => [...group.towns]) ?? [];
  if (campaign?.otherTown) towns.push(campaign.otherTown);
  const isOtherTown = Boolean(campaign?.otherTown && read("region") === campaign.otherTown);
  const phone = read("phone").replace(/[\s()-]/g, "").replace(/^(?:\+91|91)(?=\d{10}$)/, "");
  const data: Enquiry = { campaign: campaign?.id, name: read("name"), phone, grade: read("grade"), region: read("region"), city: isOtherTown ? read("city") : "", interest: read("interest"), drive: read("drive"), consent: value.consent === true, website: read("website") };
  if (data.name.length < 2 || data.name.length > 80 || /[\r\n]/.test(data.name)) errors.name = "Enter a parent or guardian’s name (2–80 characters).";
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!CLASS_OPTIONS.includes(data.grade)) errors.grade = "Please select a class.";
  if (!towns.includes(data.region)) errors.region = "Please select your city.";
  if (isOtherTown && (data.city.length < 2 || data.city.length > 80 || /[\r\n]/.test(data.city))) errors.city = "Enter your town or village (2–80 characters).";
  if (!INTERESTS.includes(data.interest)) errors.interest = "Please choose what you’re interested in.";
  if (data.drive && !campaign?.driveStops.some(stop => stop.city === data.drive)) errors.drive = "Please choose an admission drive city.";
  if (!data.consent) errors.consent = "Please agree to be contacted about your enquiry.";
  if (data.website) errors.form = "We couldn’t process this enquiry. Please call admissions.";
  return Object.keys(errors).length ? { errors } : { data, errors };
}

export const ADMISSIONS_EMAIL = "admissions@doonglobalschool.edu.in";
export const ADMISSIONS_WHATSAPP = "918650728951";
export const ADMISSIONS_WHATSAPP_LABEL = "+91 86507 28951";

function enquiryMessage(data: Enquiry) {
  const campaign = getCampaign(data.campaign ?? "north-east");
  if (!campaign) throw new Error("Unknown campaign");
  const place = data.region === campaign.otherTown ? `${data.city}, ${campaign.name}` : data.region;
  const area = campaign.id === "uttarakhand" ? campaign.homeGroups.find(group => group.towns.includes(data.region))?.label : undefined;
  const subject = `2027–28 ${campaign.name} ${data.drive ? `admission drive · ${data.drive}` : "boarding enquiry"} · Class ${data.grade} · ${place}`;
  const request = data.drive ? `I would like to register my interest in the ${campaign.name} admission drive in ${data.drive} for the 2027–28 session. Please confirm the date and venue when available.` : "I would like to request a callback about the 2027–28 session.";
  const body = `Hello Doon Global School Admissions,\n\n${request}\n\nParent / guardian: ${data.name}\nMobile: +91 ${data.phone}\nChild’s class: ${data.grade}\nCity: ${place}${area ? ` (${area})` : ""}\nInterested in: ${data.interest}\n${data.drive ? `Admission drive: ${data.drive}\n` : ""}Campaign: ${campaign.name}${campaign.id === "uttarakhand" ? " — Garhwal & Kumaun" : ""}\n\nPlease share the admissions process, fees, boarding arrangements and programmes available for this class.\n\nThank you,\n${data.name}`;
  return { subject, body };
}

export function createEnquiryEmail(data: Enquiry) {
  const { subject, body } = enquiryMessage(data);
  return `mailto:${ADMISSIONS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Opens a WhatsApp chat with admissions, with the same enquiry text pre-filled.
export function createEnquiryWhatsApp(data: Enquiry) {
  return `https://wa.me/${ADMISSIONS_WHATSAPP}?text=${encodeURIComponent(enquiryMessage(data).body)}`;
}
