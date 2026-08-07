import { z } from "zod/v4"

export const preferredContactMethodValues = ["email", "phone"] as const

export const contactFormFieldLimits = {
  name: { min: 2, max: 100 },
  subject: { min: 3, max: 160 },
  message: { min: 10, max: 2000 },
  email: { max: 254 },
  phone: { min: 7, max: 32 },
} as const

const baseContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(contactFormFieldLimits.name.min, "Please enter your name.")
    .max(
      contactFormFieldLimits.name.max,
      `Please keep your name under ${contactFormFieldLimits.name.max} characters.`
    ),
  subject: z
    .string()
    .trim()
    .min(contactFormFieldLimits.subject.min, "Please enter a subject.")
    .max(
      contactFormFieldLimits.subject.max,
      `Please keep your subject under ${contactFormFieldLimits.subject.max} characters.`
    ),
  message: z
    .string()
    .trim()
    .min(contactFormFieldLimits.message.min, "Please enter a longer message.")
    .max(
      contactFormFieldLimits.message.max,
      `Please keep your message under ${contactFormFieldLimits.message.max} characters.`
    ),
})

const emailContactFormSchema = baseContactFormSchema.extend({
  preferredContactMethod: z.literal("email"),
  contactValue: z
    .string()
    .trim()
    .max(
      contactFormFieldLimits.email.max,
      `Please keep your email under ${contactFormFieldLimits.email.max} characters.`
    )
    .email("Please enter a valid email address."),
})

const phoneContactFormSchema = baseContactFormSchema.extend({
  preferredContactMethod: z.literal("phone"),
  contactValue: z
    .string()
    .trim()
    .min(contactFormFieldLimits.phone.min, "Please enter a valid phone number.")
    .max(
      contactFormFieldLimits.phone.max,
      `Please keep your phone number under ${contactFormFieldLimits.phone.max} characters.`
    ),
})

export const contactFormSchema = z.discriminatedUnion(
  "preferredContactMethod",
  [emailContactFormSchema, phoneContactFormSchema]
)

export type ContactFormValues = z.infer<typeof contactFormSchema>
