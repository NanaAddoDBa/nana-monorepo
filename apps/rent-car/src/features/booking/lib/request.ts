import { estimatedBaseTotal, rentalDays } from "../../../shared/lib/dates.ts";

export interface BookingRequest {
  carName: string;
  dailyRate: number;
  pickupCity: string;
  returnCity?: string;
  pickupTime?: string;
  returnTime?: string;
  billableDays?: number;
  baseAmountCents?: number;
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
    "Pickup: " + details.pickupCity + (details.returnCity ? " / Return: " + details.returnCity : ""),
    "Dates: " + details.pickupDate + (details.pickupTime ? " " + details.pickupTime : "") + " to " + details.returnDate + (details.returnTime ? " " + details.returnTime : ""),
    "Rental days: " + (details.billableDays ?? days),
    "Indicative base total: EUR " + (details.baseAmountCents !== undefined ? (details.baseAmountCents / 100).toFixed(2) : estimatedBaseTotal(
      details.dailyRate,
      details.pickupDate,
      details.returnDate,
    )),
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
