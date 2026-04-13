import { Resend } from "resend"

import type { ContactFormValues } from "@/lib/validations/contactFormSchema"

function getRequiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is not configured.`)
  }

  return value
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

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Portfolio contact: ${values.subject}`,
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
