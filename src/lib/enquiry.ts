export const CLASS_OPTIONS = Array.from({ length: 10 }, (_, index) => String(index + 3));
export const REGIONS = ["Siliguri", "Darjeeling / North Bengal", "Sikkim", "Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Other"];
export const INTERESTS = ["Boarding admissions", "Activities & programmes", "Both"];

export type Enquiry = { name: string; phone: string; grade: string; region: string; city: string; interest: string; consent: boolean; website: string };

export function validateEnquiry(input: unknown): { data?: Enquiry; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object") return { errors: { form: "Please complete the enquiry form." } };
  const value = input as Record<string, unknown>;
  const read = (key: string) => typeof value[key] === "string" ? value[key].trim() : "";
  const phone = read("phone").replace(/[\s()-]/g, "").replace(/^(?:\+91|91)(?=\d{10}$)/, "");
  const data: Enquiry = { name: read("name"), phone, grade: read("grade"), region: read("region"), city: read("city"), interest: read("interest"), consent: value.consent === true, website: read("website") };
  if (data.name.length < 2 || data.name.length > 80 || /[\r\n]/.test(data.name)) errors.name = "Enter a parent or guardian’s name (2–80 characters).";
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!CLASS_OPTIONS.includes(data.grade)) errors.grade = "Please select a class.";
  if (!REGIONS.includes(data.region)) errors.region = "Please select your city or state.";
  if (data.region === "Other" && (data.city.length < 2 || data.city.length > 80)) errors.city = "Enter your city (2–80 characters).";
  if (!INTERESTS.includes(data.interest)) errors.interest = "Please choose what you’re interested in.";
  if (!data.consent) errors.consent = "Please agree to be contacted about your enquiry.";
  if (data.website) errors.form = "We couldn’t process this enquiry. Please call admissions.";
  return Object.keys(errors).length ? { errors } : { data, errors };
}

export function createEnquiryEmail(data: Enquiry) {
  const subject = `2027–28 boarding enquiry · Class ${data.grade} · ${data.region === "Other" ? data.city : data.region}`;
  const body = `Hello Doon Global School Admissions,\n\nI would like to request a callback about the 2027–28 session.\n\nParent / guardian: ${data.name}\nMobile: +91 ${data.phone}\nChild’s class: ${data.grade}\nCity / state: ${data.region === "Other" ? data.city : data.region}\nInterested in: ${data.interest}\n\nPlease share the admissions process, fees, boarding arrangements and programmes available for this class.\n\nThank you,\n${data.name}`;
  return `mailto:admissions@doonglobalschool.edu.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
