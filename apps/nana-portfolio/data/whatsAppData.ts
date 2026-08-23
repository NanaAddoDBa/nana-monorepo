export const whatsAppPrefilledMessage =
  "Hi Nana Addo, I found your portfolio and would like to discuss a potential opportunity or collaboration."

function createWhatsAppHref(phoneNumber: string) {
  const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "")

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(whatsAppPrefilledMessage)}`
}

export const whatsAppContacts = [
  {
    id: "germany",
    region: "Germany",
    designation: "Primary",
    phoneNumber: "+49 176 7490 9252",
    href: createWhatsAppHref("+4917674909252"),
    ariaLabel:
      "Message Nana Addo on WhatsApp using the primary Germany phone number.",
  },
  {
    id: "ghana",
    region: "Ghana",
    designation: "Alternative",
    phoneNumber: "+233 24 775 7690",
    href: createWhatsAppHref("+233247757690"),
    ariaLabel:
      "Message Nana Addo on WhatsApp using the alternative Ghana phone number.",
  },
] as const
