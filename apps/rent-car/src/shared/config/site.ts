export const site = {
  name: "Aventra",
  tagline: "Drive a little further.",
  bookingEmail: (import.meta.env.VITE_BOOKING_EMAIL || "").trim(),
  phone: (import.meta.env.VITE_CONTACT_PHONE || "").trim(),
  locations: ["Munich", "Berlin", "Hamburg", "Frankfurt"],
  currency: "EUR",
  enquiryApiUrl: (import.meta.env.VITE_ENQUIRY_API_URL || "").trim(),
  useEnquiryApi: import.meta.env.VITE_ENABLE_LIVE_ENQUIRIES === "true" && Boolean((import.meta.env.VITE_ENQUIRY_API_URL || "").trim()),
  usePaidBookings: import.meta.env.VITE_ENABLE_PAID_BOOKINGS === "true" && Boolean((import.meta.env.VITE_ENQUIRY_API_URL || "").trim()),
} as const;

export function priceLabel(value: number): string {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}
