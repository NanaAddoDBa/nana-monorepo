export const whatsAppPrefilledMessage =
  "Hi Nana Addo, I found your portfolio and would like to discuss a potential opportunity or collaboration."

function createWhatsAppHref(phoneNumber: string) {
  const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "")

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(whatsAppPrefilledMessage)}`
}

export const whatsAppContacts = [
  {
    id: "ghana",
    region: "Ghana",
    phoneNumber: "+233 24 775 7690",
    href: createWhatsAppHref("+233247757690"),
    ariaLabel: "Message Nana Addo on WhatsApp using the Ghana phone number.",
  },
  {
    id: "germany",
    region: "Germany",
    phoneNumber: "+49 176 7490 9252",
    href: createWhatsAppHref("+4917674909252"),
    ariaLabel: "Message Nana Addo on WhatsApp using the Germany phone number.",
  },
] as const
