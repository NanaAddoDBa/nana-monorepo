import { Clock, Mail, MapPin, MessageCircle } from "lucide-react"

import type { ContactData } from "@/types/contactSectionTypes"
import { whatsAppContacts } from "@/data/whatsAppData"

export const contactData = {
  title: "Let's Connect",
  subtitle: "Get in touch for opportunities or collaborations",
  targetedCvNote:
    "Need a role-specific CV? Request a targeted version for frontend, full-stack, test, QA, or automation-focused roles.",
  contactInfo: [
    {
      label: "Email",
      value: "nanaaddoldoe@gmail.com",
      icon: Mail,
      href: "mailto:nanaaddoldoe@gmail.com",
      ariaLabel: "Email Nana Addo directly.",
    },
    ...whatsAppContacts.map((contact) => ({
      label: `WhatsApp · ${contact.region} (${contact.designation})`,
      value: contact.phoneNumber,
      icon: MessageCircle,
      href: contact.href,
      ariaLabel: contact.ariaLabel,
    })),
    {
      label: "Location",
      value: "Passau, Germany",
      icon: MapPin,
      href: "https://maps.google.com/?q=Passau, Germany",
      ariaLabel: "View Nana Addo's location in Passau on Google Maps.",
    },
  ],
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
} satisfies ContactData
