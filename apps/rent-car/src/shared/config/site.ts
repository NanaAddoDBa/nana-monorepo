export const site = {
  name: "Aventra",
  shortName: "AVENTRA",
  tagline: "Drive a little further.",
  bookingEmail: (import.meta.env.VITE_BOOKING_EMAIL || "").trim(),
  phone: (import.meta.env.VITE_CONTACT_PHONE || "").trim(),
  isLive: import.meta.env.VITE_PRODUCTION_READY === "true",
  locations: ["Munich", "Berlin", "Hamburg", "Frankfurt"],
  currency: "EUR",
} as const;

export function priceLabel(value: number): string {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}