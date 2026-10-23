export interface RentalLocation {
  id: string;
  name: string;
  timeZone: string;
}

export interface VehicleRate {
  id: string;
  dailyRateCents: number;
  pickupLocations: readonly string[];
}

// Illustrative contract data: do not accept commercial enquiries against it
// without verified inventory, policies and an operator's approval.
export const rentalLocations: readonly RentalLocation[] = [
  { id: "munich", name: "Munich", timeZone: "Europe/Berlin" },
  { id: "berlin", name: "Berlin", timeZone: "Europe/Berlin" },
  { id: "hamburg", name: "Hamburg", timeZone: "Europe/Berlin" },
  { id: "frankfurt", name: "Frankfurt", timeZone: "Europe/Berlin" },
];

export const vehicleRates: readonly VehicleRate[] = [
  { id: "urban-hybrid", dailyRateCents: 5800, pickupLocations: ["munich", "berlin", "hamburg"] },
  { id: "executive-class", dailyRateCents: 8900, pickupLocations: ["munich", "frankfurt", "berlin"] },
  { id: "all-terrain-suv", dailyRateCents: 10500, pickupLocations: ["munich", "hamburg", "frankfurt"] },
  { id: "electric-escape", dailyRateCents: 9200, pickupLocations: ["berlin", "hamburg", "frankfurt"] },
  { id: "weekend-gt", dailyRateCents: 14900, pickupLocations: ["munich", "frankfurt"] },
  { id: "family-touring", dailyRateCents: 11900, pickupLocations: ["berlin", "hamburg", "munich"] },
];

export function locationById(id: string) {
  return rentalLocations.find((place) => place.id === id);
}

export function locationIdForName(name: string) {
  return rentalLocations.find((place) => place.name.toLowerCase() === name.toLowerCase())?.id;
}

export function vehicleRateById(id: string) {
  return vehicleRates.find((item) => item.id === id);
}
