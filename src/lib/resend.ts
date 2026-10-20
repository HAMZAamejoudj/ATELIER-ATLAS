import { Resend } from "resend";

import { BRAND_NAME, SITE_CONTACT_EMAIL } from "@/lib/constants";
import type { ContactInquiry } from "@/lib/contact-types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function fromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `${BRAND_NAME} <onboarding@resend.dev>`
  );
}

const INQUIRY_LABELS: Record<ContactInquiry["type"], string> = {
  general: "General",
  bespoke: "Bespoke",
  trade: "Trade",
  appointment: "Appointment",
};

export async function sendContactInquiryEmail(input: {
  inquiry: ContactInquiry;
  to: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.error("RESEND_API_KEY is not set — contact email was not sent.");
    return { sent: false as const, error: "Missing RESEND_API_KEY" };
  }

  const { inquiry, to } = input;
  const typeLabel = INQUIRY_LABELS[inquiry.type];
  const safeName = escapeHtml(inquiry.name);
  const safeEmail = escapeHtml(inquiry.email);
  const safePhone = inquiry.phone ? escapeHtml(inquiry.phone) : "—";
  const safeSubject = escapeHtml(inquiry.subject);
  const safeMessage = escapeHtml(inquiry.message).replace(/\n/g, "<br />");

  const { data, error } = await resend.emails.send(
    {
      from: fromAddress(),
      to: [to],
      replyTo: inquiry.email,
      subject: `[${typeLabel}] ${inquiry.subject} — ${inquiry.name}`,
      html: `
        <div style="font-family:Georgia,serif;color:#1a1614;line-height:1.6;max-width:560px">
          <p style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#6b635c">
            ${escapeHtml(BRAND_NAME)} · Contact inquiry
          </p>
          <h1 style="font-size:22px;font-weight:600;margin:12px 0 20px">${safeSubject}</h1>
          <p><strong>Type:</strong> ${typeLabel}</p>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p style="margin-top:20px"><strong>Message</strong></p>
          <p>${safeMessage}</p>
        </div>
      `,
      text: [
        `${BRAND_NAME} contact inquiry`,
        `Type: ${typeLabel}`,
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        `Phone: ${inquiry.phone || "—"}`,
        `Subject: ${inquiry.subject}`,
        "",
        inquiry.message,
      ].join("\n"),
    },
    { idempotencyKey: `contact-inquiry/${inquiry.id}` },
  );

  if (error) {
    console.error("Resend contact email failed:", error.message);
    return { sent: false as const, error: error.message };
  }

  return { sent: true as const, id: data?.id };
}

export function contactNotifyEmail() {
  return process.env.CONTACT_NOTIFY_EMAIL?.trim() || SITE_CONTACT_EMAIL;
}
