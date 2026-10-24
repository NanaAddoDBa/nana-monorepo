import { Clock, Mail, MapPin, MessageCircle } from "lucide-react"

import type { ContactData } from "@/types/contactSectionTypes"
import { whatsAppContacts } from "@/data/whatsAppData"

export const contactData = {
  title: "Let's build something useful.",
  subtitle:
    "Have a frontend or applied AI opportunity in mind? I'd love to hear about your team and what you're working on.",
  targetedCvNote:
    "Based in Passau, Germany. Available for full-time work immediately.",
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
    timezone: "Europe/Berlin (CET / CEST)",
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
