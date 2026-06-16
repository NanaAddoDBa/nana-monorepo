import { Resend } from "resend"

import type { ContactFormValues } from "@/lib/validations/contactFormSchema"

function getRequiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is not configured.`)
  }

  return value
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export async function sendContactEmail(values: ContactFormValues) {
  const resend = new Resend(
    getRequiredEnv("RESEND_API_KEY", process.env.RESEND_API_KEY)
  )

  const from = getRequiredEnv(
    "RESEND_FROM_EMAIL",
    process.env.RESEND_FROM_EMAIL
  )

  const to = getRequiredEnv(
    "CONTACT_RECEIVER_EMAIL",
    process.env.CONTACT_RECEIVER_EMAIL
  )

  const contactLabel =
    values.preferredContactMethod === "email" ? "Email" : "Phone"

  const text = [
    "New portfolio contact submission",
    "",
    `Name: ${values.name}`,
    `Preferred contact method: ${values.preferredContactMethod}`,
    `${contactLabel}: ${values.contactValue}`,
    `Subject: ${values.subject}`,
    "",
    "Message:",
    values.message,
  ].join("\n")

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 16px;">New portfolio contact submission</h2>

      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(values.name)}</p>
      <p style="margin: 0 0 8px;"><strong>Preferred contact method:</strong> ${escapeHtml(values.preferredContactMethod)}</p>
      <p style="margin: 0 0 8px;"><strong>${contactLabel}:</strong> ${escapeHtml(values.contactValue)}</p>
      <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${escapeHtml(values.subject)}</p>

      <div style="margin-top: 20px;">
        <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
        <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
          ${escapeHtml(values.message).replaceAll("\n", "<br />")}
        </div>
      </div>
    </div>
  `

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Portfolio contact: ${values.subject}`,
    html,
    text,
  })

  if (error) {
    throw new Error(error.message || "Failed to send contact email.")
  }

  if (!data?.id) {
    throw new Error("Contact email was accepted without a message id.")
  }

  return data.id
}
