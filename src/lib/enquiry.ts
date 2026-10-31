export const CLASS_OPTIONS = Array.from({ length: 10 }, (_, index) => String(index + 3));
export const DRIVE_CITIES = ["Guwahati", "Aizawl", "Itanagar", "Jorhat", "Dimapur", "Siliguri", "Kolkata"] as const;
export const REGIONS: readonly string[] = DRIVE_CITIES;
export const ADMISSION_CITY_LABEL = `${DRIVE_CITIES.slice(0, -1).join(", ")} and ${DRIVE_CITIES[DRIVE_CITIES.length - 1]}`;
export const INTERESTS = ["Boarding admissions", "Activities & programmes", "Both"];
export type DriveCity = (typeof DRIVE_CITIES)[number];

export type Enquiry = { name: string; phone: string; grade: string; region: string; city: string; interest: string; drive: string; consent: boolean; website: string };

export function validateEnquiry(input: unknown): { data?: Enquiry; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object") return { errors: { form: "Please complete the enquiry form." } };
  const value = input as Record<string, unknown>;
  const read = (key: string) => typeof value[key] === "string" ? value[key].trim() : "";
  const phone = read("phone").replace(/[\s()-]/g, "").replace(/^(?:\+91|91)(?=\d{10}$)/, "");
  const data: Enquiry = { name: read("name"), phone, grade: read("grade"), region: read("region"), city: read("city"), interest: read("interest"), drive: read("drive"), consent: value.consent === true, website: read("website") };
  if (data.name.length < 2 || data.name.length > 80 || /[\r\n]/.test(data.name)) errors.name = "Enter a parent or guardian’s name (2–80 characters).";
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!CLASS_OPTIONS.includes(data.grade)) errors.grade = "Please select a class.";
  if (!REGIONS.includes(data.region)) errors.region = "Please select your city.";
  if (!INTERESTS.includes(data.interest)) errors.interest = "Please choose what you’re interested in.";
  if (data.drive && !DRIVE_CITIES.some(city => city === data.drive)) errors.drive = "Please choose an admission drive city.";
  if (!data.consent) errors.consent = "Please agree to be contacted about your enquiry.";
  if (data.website) errors.form = "We couldn’t process this enquiry. Please call admissions.";
  return Object.keys(errors).length ? { errors } : { data, errors };
}

export function createEnquiryEmail(data: Enquiry) {
  const place = data.region;
  const subject = `${data.drive ? `2027–28 admission drive · ${data.drive}` : "2027–28 boarding enquiry"} · Class ${data.grade} · ${place}`;
  const request = data.drive ? `I would like to register for the North East admission drive in ${data.drive} for the 2027–28 session.` : "I would like to request a callback about the 2027–28 session.";
  const body = `Hello Doon Global School Admissions,\n\n${request}\n\nParent / guardian: ${data.name}\nMobile: +91 ${data.phone}\nChild’s class: ${data.grade}\nCity: ${place}\nInterested in: ${data.interest}\n${data.drive ? `Admission drive: ${data.drive}\n` : ""}\nPlease share the admissions process, fees, boarding arrangements and programmes available for this class.\n\nThank you,\n${data.name}`;
  return `mailto:admissions@doonglobalschool.edu.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
