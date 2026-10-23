import { locationById, locationIdForName } from "./catalogue.ts";

export interface RentalTrip {
  pickupLocationId: string;
  returnLocationId: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const CLOCK_TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const MS_DAY = 86_400_000;
const MAX_DURATION = 30 * MS_DAY;
const FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function formatAt(epoch: number, zone: string): number[] {
  let format = FORMATTERS.get(zone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    });
    FORMATTERS.set(zone, format);
  }
  const parts = format.formatToParts(epoch);
  const named = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return [Number(named.year), Number(named.month), Number(named.day),
    Number(named.hour), Number(named.minute), Number(named.second)];
}

export function localDateTimeToEpoch(date: string, time: string, zone: string): number | null {
  if (!ISO_DATE.test(date) || !CLOCK_TIME.test(time)) return null;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const pretendUtc = Date.UTC(year, month - 1, day, hour, minute);
  if (new Date(pretendUtc).toISOString().slice(0, 10) !== date) return null;

  const offsets = new Set<number>();
  for (const near of [pretendUtc - MS_DAY, pretendUtc, pretendUtc + MS_DAY]) {
    try {
      const parts = formatAt(near, zone);
      offsets.add(Date.UTC(...([parts[0], parts[1] - 1, ...parts.slice(2)] as [number,number,number,number,number,number])) - near);
    } catch {
      return null;
    }
  }
  const matching: number[] = [];
  for (const offset of offsets) {
    const candidate = pretendUtc - offset;
    const values = formatAt(candidate, zone);
    if ([year, month, day, hour, minute, 0].every((value, i) => values[i] === value)) {
      matching.push(candidate);
    }
  }
  // During the autumn clock change the earlier of two valid instants is used.
  // Non-existent spring-forward times are rejected.
  return matching.length ? Math.min(...matching) : null;
}

export function validateTrip(trip: RentalTrip, now = Date.now()): string[] {
  const issues: string[] = [];
  const pickupLocation = locationById(trip.pickupLocationId);
  const returnLocation = locationById(trip.returnLocationId);
  if (!pickupLocation) issues.push("Choose a supported pickup location.");
  if (!returnLocation) issues.push("Choose a supported return location.");
  const pickup = pickupLocation ? localDateTimeToEpoch(trip.pickupDate, trip.pickupTime, pickupLocation.timeZone) : null;
  const dropoff = returnLocation ? localDateTimeToEpoch(trip.returnDate, trip.returnTime, returnLocation.timeZone) : null;
  if (pickup === null) issues.push("Choose a valid pickup date and time.");
  if (dropoff === null) issues.push("Choose a valid return date and time.");
  if (pickup !== null && dropoff !== null) {
    if (pickup <= now) issues.push("Pickup must be in the future.");
    if (dropoff <= pickup) issues.push("Return must be after pickup.");
    if (dropoff - pickup > MAX_DURATION) issues.push("A single enquiry can cover at most 30 days.");
  }
  return issues;
}

export function billableDays(trip: RentalTrip): number {
  const pickupLocation = locationById(trip.pickupLocationId);
  const returnLocation = locationById(trip.returnLocationId);
  if (!pickupLocation || !returnLocation) return 0;
  const pickup = localDateTimeToEpoch(trip.pickupDate, trip.pickupTime, pickupLocation.timeZone);
  const dropoff = localDateTimeToEpoch(trip.returnDate, trip.returnTime, returnLocation.timeZone);
  if (pickup === null || dropoff === null || dropoff <= pickup || dropoff - pickup > MAX_DURATION) return 0;
  return Math.max(1, Math.ceil((dropoff - pickup) / MS_DAY));
}

export const TRIP_FIELDS = [
  "pickupLocation", "returnLocation", "pickupDate", "pickupTime",
  "returnDate", "returnTime",
] as const;

export function tripFromParams(params: URLSearchParams): RentalTrip | null {
  if (!TRIP_FIELDS.some((field) => params.has(field)) && !["city","pickup","return"].some((field) => params.has(field))) return null;
  const legacyId = locationIdForName(params.get("city") || "") || "munich";
  return {
    pickupLocationId: params.get("pickupLocation") || legacyId,
    returnLocationId: params.get("returnLocation") || params.get("pickupLocation") || legacyId,
    pickupDate: params.get("pickupDate") || params.get("pickup") || "",
    pickupTime: params.get("pickupTime") || "10:00",
    returnDate: params.get("returnDate") || params.get("return") || "",
    returnTime: params.get("returnTime") || "10:00",
  };
}

export function serializeTrip(trip: RentalTrip): URLSearchParams {
  return new URLSearchParams({
    pickupLocation: trip.pickupLocationId, returnLocation: trip.returnLocationId,
    pickupDate: trip.pickupDate, pickupTime: trip.pickupTime,
    returnDate: trip.returnDate, returnTime: trip.returnTime,
  });
}

export function makeDefaultTrip(from = new Date()): RentalTrip {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1, 12);
  const returned = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 4, 12);
  const iso = (value: Date) => [value.getFullYear(), String(value.getMonth() + 1).padStart(2, "0"), String(value.getDate()).padStart(2, "0")].join("-");
  return {
    pickupLocationId: "munich", returnLocationId: "munich",
    pickupDate: iso(today), pickupTime: "10:00",
    returnDate: iso(returned), returnTime: "10:00",
  };
}
