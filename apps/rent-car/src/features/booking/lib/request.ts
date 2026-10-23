import { estimatedBaseTotal, rentalDays } from "../../../shared/lib/dates.ts";

export interface BookingRequest {
  carName: string;
  dailyRate: number;
  pickupCity: string;
  pickupDate: string;
  returnDate: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  message: string;
}

export function bookingRequestText(details: BookingRequest): string {
  const days = rentalDays(details.pickupDate, details.returnDate);

  return [
    "Hello, I would like to request availability for a rental.",
    "",
    "Vehicle: " + details.carName,
    "Pickup: " + details.pickupCity,
    "Dates: " + details.pickupDate + " to " + details.returnDate,
    "Rental days: " + days,
    "Indicative base total: EUR " + estimatedBaseTotal(
      details.dailyRate,
      details.pickupDate,
      details.returnDate,
    ),
    "",
    "Name: " + details.customerName,
    "Email: " + details.customerEmail,
    "Phone: " + (details.phone || "Not supplied"),
    "Notes: " + (details.message || "None"),
    "",
    "Please confirm availability, the final quote, terms, and next steps.",
  ].join("\n");
}

export function mailtoBooking(
  email: string,
  details: BookingRequest,
): string {
  const subject = encodeURIComponent("Availability request: " + details.carName);
  const body = encodeURIComponent(bookingRequestText(details));

  return "mailto:" + email + "?subject=" + subject + "&body=" + body;
}
