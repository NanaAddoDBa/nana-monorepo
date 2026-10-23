export const site = {
  name: "Aventra",
  tagline: "Drive a little further.",
  bookingEmail: (import.meta.env.VITE_BOOKING_EMAIL || "").trim(),
  phone: (import.meta.env.VITE_CONTACT_PHONE || "").trim(),
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
