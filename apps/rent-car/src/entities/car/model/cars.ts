export type CarCategory =
  | "Compact"
  | "Sedan"
  | "SUV"
  | "Electric"
  | "Performance";

export type Transmission = "Automatic" | "Manual";

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  summary: string;
  seats: number;
  luggage: number;
  transmission: Transmission;
  fuel: string;
  dailyRate: number;
  image: string;
  locations: string[];
  features: string[];
  featured?: boolean;
  accent: string;
}

// Example records; replace with verified inventory before taking rental enquiries.
export const cars: Car[] = [
  {
    id: "urban-hybrid",
    name: "Compact Hybrid",
    category: "Compact",
    summary: "Automatic hybrid for everyday city travel.",
    seats: 4,
    luggage: 2,
    transmission: "Automatic",
    fuel: "Hybrid",
    dailyRate: 58,
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1400&q=85",
    locations: ["Munich", "Berlin", "Hamburg"],
    features: ["Air conditioning", "Bluetooth", "Parking sensors", "USB-C"],
    accent: "#e7dfd3",
  },
  {
    id: "executive-class",
    name: "Executive Sedan",
    category: "Sedan",
    summary: "Five-seat automatic sedan for longer journeys.",
    seats: 5,
    luggage: 3,
    transmission: "Automatic",
    fuel: "Petrol",
    dailyRate: 89,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=85",
    locations: ["Munich", "Frankfurt", "Berlin"],
    features: ["Navigation", "Cruise control", "Heated seats", "Bluetooth"],
    featured: true,
    accent: "#d9e3e4",
  },
  {
    id: "all-terrain-suv",
    name: "Mid-size SUV",
    category: "SUV",
    summary: "Five-seat SUV with extra luggage space.",
    seats: 5,
    luggage: 4,
    transmission: "Automatic",
    fuel: "Diesel",
    dailyRate: 105,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85",
    locations: ["Munich", "Hamburg", "Frankfurt"],
    features: ["Navigation", "Spacious boot", "Parking camera", "Cruise control"],
    featured: true,
    accent: "#dce3d2",
  },
  {
    id: "electric-escape",
    name: "Electric Sedan",
    category: "Electric",
    summary: "Electric powertrain with automatic transmission.",
    seats: 5,
    luggage: 3,
    transmission: "Automatic",
    fuel: "Electric",
    dailyRate: 92,
    image: "https://images.unsplash.com/photo-1597404294360-feeeda04612e?auto=format&fit=crop&w=1400&q=85",
    locations: ["Berlin", "Hamburg", "Frankfurt"],
    features: ["Electric powertrain", "Navigation", "USB-C", "Parking camera"],
    accent: "#dce2e7",
  },
  {
    id: "weekend-gt",
    name: "Performance Coupe",
    category: "Performance",
    summary: "Two-seat automatic performance car.",
    seats: 2,
    luggage: 2,
    transmission: "Automatic",
    fuel: "Petrol",
    dailyRate: 149,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
    locations: ["Munich", "Frankfurt"],
    features: ["Performance drive", "Navigation", "Premium audio", "Climate control"],
    accent: "#e4d9d4",
  },
  {
    id: "family-touring",
    name: "Seven-seat SUV",
    category: "SUV",
    summary: "Hybrid SUV with seating for seven passengers.",
    seats: 7,
    luggage: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    dailyRate: 119,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
    locations: ["Berlin", "Hamburg", "Munich"],
    features: ["7 seats", "Navigation", "Child-seat compatible", "Cruise control"],
    accent: "#e8e0d6",
  },
];

export function findCar(id: string | undefined): Car | undefined {
  return cars.find((car) => car.id === id);
}
