import { Mail, Phone, MapPin, Clock, type LucideIcon } from "lucide-react"

interface ContactMethod {
  label: string
  value: string
  icon: LucideIcon
  href: string
}

interface Availability {
  timezone: string
  hours: string
  days: string
  icon: LucideIcon
  calendlyLink: string
}

interface FormField {
  label: string
  placeholder: string
  required: boolean
}

interface ContactValueField {
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  required: boolean
}

interface PreferredContactMethod {
  id: "email" | "phone"
  label: string
}

interface ContactData {
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

export const contactData: ContactData = {
  title: "Let's Connect",
  subtitle: "Get in touch for opportunities or collaborations",
  contactInfo: {
    email: {
      label: "Email",
      value: "andybampoe.ad@gmail.com",
      icon: Mail,
      href: "mailto:andybampoe.ad@gmail.com",
    },
    phone: {
      label: "Phone",
      value: "+49 176 74909252",
      icon: Phone,
      href: "tel:+491767490925",
    },
    location: {
      label: "Location",
      value: "Dr. Hans Kapfinger Straße 13, Passau",
      icon: MapPin,
      href: "https://maps.google.com/?q=Dr. Hans Kapfinger Straße 13, Passau",
    },
  },
  availability: {
    timezone: "CET (UTC+1)",
    hours: "9:00 AM - 6:00 PM",
    days: "Monday - Saturday",
    icon: Clock,
    calendlyLink: "https://calendly.com/nanaaddoldoe/30min",
  },
  formFields: {
    name: { label: "Name", placeholder: "Enter your name", required: true },
    contactValue: {
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      phoneLabel: "Phone",
      phonePlaceholder: "Enter your phone number",
      required: true,
    },
    subject: {
      label: "Subject",
      placeholder: "Enter your subject",
      required: true,
    },
    message: {
      label: "Message",
      placeholder: "Enter your message",
      required: true,
    },
  },
  preferredContactMethods: [
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
  ],
  submitLabel: "Send Message",
  successMessage: "Thanks for reaching out! I'll get back to you soon.",
  errorMessage: "Something went wrong. Please try again later.",
}
