const ONE_DAY = 86_400_000;

export function parseISODate(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);

  if (new Date(timestamp).toISOString().slice(0, 10) !== value) return null;
  return timestamp;
}

export function addCalendarDays(value: string, days: number): string {
  const timestamp = parseISODate(value);
  if (timestamp === null || !Number.isInteger(days)) return "";
  return new Date(timestamp + days * ONE_DAY).toISOString().slice(0, 10);
}

export function rentalDays(pickupDate: string, returnDate: string): number {
  const pickup = parseISODate(pickupDate);
  const dropoff = parseISODate(returnDate);

  if (pickup === null || dropoff === null || dropoff <= pickup) return 0;
  return Math.round((dropoff - pickup) / ONE_DAY);
}

export function dateOffset(days: number, from = new Date()): string {
  const date = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate() + days,
    12,
  );

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function isValidRentalPeriod(
  pickupDate: string,
  returnDate: string,
  today = dateOffset(0),
): boolean {
  return pickupDate >= today && rentalDays(pickupDate, returnDate) > 0;
}

export function estimatedBaseTotal(
  dailyRate: number,
  pickupDate: string,
  returnDate: string,
): number {
  return Math.max(0, dailyRate) * rentalDays(pickupDate, returnDate);
}
