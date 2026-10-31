import { NextResponse } from "next/server";
import { createEnquiryEmail, createEnquiryWhatsApp, validateEnquiry } from "@/lib/enquiry";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || new URL(request.url).host;
  if (origin) {
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ error: "Please submit from this website." }, { status: 403 });
    } catch { return NextResponse.json({ error: "Invalid request origin." }, { status: 403 }); }
  }
  if (Number(request.headers.get("content-length") || 0) > 8192) return NextResponse.json({ error: "This enquiry is too large." }, { status: 413 });
  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 8192) return NextResponse.json({ error: "This enquiry is too large." }, { status: 413 });
    input = JSON.parse(body);
  } catch { return NextResponse.json({ error: "Please check your enquiry and try again." }, { status: 400 }); }
  const { data, errors } = validateEnquiry(input);
  if (!data) return NextResponse.json({ errors }, { status: 400 });
  const webhook = process.env.ADMISSIONS_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ delivery: "email", emailUrl: createEnquiryEmail(data), whatsappUrl: createEnquiryWhatsApp(data) }, { headers: { "Cache-Control": "no-store" } });
  try {
    if (new URL(webhook).protocol !== "https:") throw new Error("HTTPS required");
    const { website: _honeypot, ...enquiry } = data;
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.ADMISSIONS_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.ADMISSIONS_WEBHOOK_TOKEN}` } : {}) },
      body: JSON.stringify({ ...enquiry, session: "2027–28", source: "north-east-landing-page", submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("Delivery failed");
    return NextResponse.json({ delivery: "sent" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Your enquiry couldn’t be delivered. Please try again or call +91 74559 97333." }, { status: 502 });
  }
}
