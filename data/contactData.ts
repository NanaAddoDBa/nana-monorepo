import { Mail, Phone, MapPin, Clock } from "lucide-react"

import type { ContactData } from "@/types/contactSectionTypes"

export const contactData = {
  title: "Let's Connect",
  subtitle: "Get in touch for opportunities or collaborations",
  contactInfo: {
    email: {
      label: "Email",
      value: "nanaaddoldoe@gmail.com",
      icon: Mail,
      href: "mailto:nanaaddoldoe@gmail.com",
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
} satisfies ContactData
