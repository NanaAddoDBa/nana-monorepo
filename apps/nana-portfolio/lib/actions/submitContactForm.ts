import type { ContactFormValues } from "@/lib/validations/contactFormSchema"

type SubmitContactFormResponse = {
  success: boolean
  message: string
  fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>
}

export class SubmitContactFormError extends Error {
  fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>

  constructor(
    message: string,
    fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>
  ) {
    super(message)
    this.name = "SubmitContactFormError"
    this.fieldErrors = fieldErrors
  }
}

export async function submitContactForm(
  values: ContactFormValues
): Promise<SubmitContactFormResponse> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })

  const data = (await response.json()) as SubmitContactFormResponse

  if (!response.ok) {
    throw new SubmitContactFormError(
      data.message || "Unable to submit contact form.",
      data.fieldErrors
    )
  }

  return data
}
