import { Mail, Phone, MapPin, Clock ,LucideIcon} from "lucide-react";

interface ContactMethod {
  label: string;
  value: string;
  icon: LucideIcon;
  href: string;
}

interface Availability {
  timezone: string;
  hours: string;
  days: string;
  icon: LucideIcon;
  calendlyLink: string;
}

interface FormField {
  label: string;
  placeholder: string;
  required: boolean;
}

interface ContactData {
  title: string;
  subtitle: string;
  contactInfo: {
    email: ContactMethod;
    phone: ContactMethod;
    location: ContactMethod;
  };
  availability: Availability;
  formFields: {
    name: FormField;
    email: FormField;
    subject: FormField;
    message: FormField;
  };
  successMessage: string;
  errorMessage: string;
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
    days: "Monday - Friday",
    icon: Clock,
    calendlyLink: "https://calendly.com/yourusername",
  },
  formFields: {
    name: { label: "Name", placeholder: "Enter your name", required: true },
    email: { label: "Email", placeholder: "Enter your email", required: true },
    subject: { label: "Subject", placeholder: "What's this about?", required: true },
    message: { label: "Message", placeholder: "Your message here...", required: true },
  },
  successMessage: "Thanks for reaching out! I'll get back to you soon.",
  errorMessage: "Something went wrong. Please try again later.",
};
