import type { LucideIcon } from "lucide-react"

export type ContactMethod = {
  label: string
  value: string
  icon: LucideIcon
  href: string
}

export type Availability = {
  timezone: string
  hours: string
  days: string
  icon: LucideIcon
  calendlyLink: string
}

export type FormField = {
  label: string
  placeholder: string
  required: boolean
}

export type ContactValueField = {
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  required: boolean
}

export type PreferredContactMethodId = "email" | "phone"

export type PreferredContactMethod = {
  id: PreferredContactMethodId
  label: string
}

export type ContactData = {
  title: string
  subtitle: string
  contactInfo: {
    email: ContactMethod
    phone: ContactMethod
    location: ContactMethod
  }
  availability: Availability
  formFields: {
    name: FormField
    contactValue: ContactValueField
    subject: FormField
    message: FormField
  }
  preferredContactMethods: PreferredContactMethod[]
  submitLabel: string
  successMessage: string
  errorMessage: string
}
