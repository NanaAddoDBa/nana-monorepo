import { z } from "zod"

export const preferredContactMethodValues = ["email", "phone"] as const

const baseContactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  subject: z.string().trim().min(3, "Please enter a subject."),
  message: z.string().trim().min(10, "Please enter a longer message."),
})

const emailContactFormSchema = baseContactFormSchema.extend({
  preferredContactMethod: z.literal("email"),
  contactValue: z.string().trim().email("Please enter a valid email address."),
})

const phoneContactFormSchema = baseContactFormSchema.extend({
  preferredContactMethod: z.literal("phone"),
  contactValue: z.string().trim().min(7, "Please enter a valid phone number."),
})

export const contactFormSchema = z.discriminatedUnion(
  "preferredContactMethod",
  [emailContactFormSchema, phoneContactFormSchema]
)

export type ContactFormValues = z.infer<typeof contactFormSchema>
