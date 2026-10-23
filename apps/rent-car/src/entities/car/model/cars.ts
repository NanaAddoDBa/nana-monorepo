export type CarCategory = "Compact" | "Sedan" | "SUV" | "Electric" | "Performance";
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

// Editorial sample inventory. Replace with verified vehicles, photos, availability and prices before launch.
export const cars: Car[] = [
  {
    id: "urban-hybrid", name: "Urban Hybrid", category: "Compact",
    summary: "Effortless city days, without compromising on comfort.",
    seats: 4, luggage: 2, transmission: "Automatic", fuel: "Hybrid",
    dailyRate: 58, image: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1400&q=85",
    locations: ["Munich", "Berlin", "Hamburg"], features: ["Air conditioning", "Bluetooth", "Parking sensors", "USB-C"],
    accent: "#e7dfd3",
  },
  {
    id: "executive-class", name: "Executive Class", category: "Sedan",
    summary: "A refined ride for business trips and long weekends.",
    seats: 5, luggage: 3, transmission: "Automatic", fuel: "Petrol",
    dailyRate: 89, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=85",
    locations: ["Munich", "Frankfurt", "Berlin"], features: ["Navigation", "Cruise control", "Heated seats", "Bluetooth"],
    featured: true, accent: "#d9e3e4",
  },
  {
    id: "all-terrain-suv", name: "All-Terrain SUV", category: "SUV",
    summary: "Room for the entire crew and all your plans.",
    seats: 5, luggage: 4, transmission: "Automatic", fuel: "Diesel",
    dailyRate: 105, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85",
    locations: ["Munich", "Hamburg", "Frankfurt"], features: ["Navigation", "Spacious boot", "Parking camera", "Cruise control"],
    featured: true, accent: "#dce3d2",
  },
  {
    id: "electric-escape", name: "Electric Escape", category: "Electric",
    summary: "Quiet, responsive driving for a new kind of getaway.",
    seats: 5, luggage: 3, transmission: "Automatic", fuel: "Electric",
    dailyRate: 92, image: "https://images.unsplash.com/photo-1597404294360-feeeda04612e?auto=format&fit=crop&w=1400&q=85",
    locations: ["Berlin", "Hamburg", "Frankfurt"], features: ["Electric powertrain", "Navigation", "USB-C", "Parking camera"],
    accent: "#dce2e7",
  },
  {
    id: "weekend-gt", name: "Weekend GT", category: "Performance",
    summary: "For the scenic route and the moments worth taking.",
    seats: 2, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    dailyRate: 149, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
    locations: ["Munich", "Frankfurt"], features: ["Performance drive", "Navigation", "Premium audio", "Climate control"],
    accent: "#e4d9d4",
  },
  {
    id: "family-touring", name: "Family Touring", category: "SUV",
    summary: "Space to settle in, wherever the road takes you.",
    seats: 7, luggage: 5, transmission: "Automatic", fuel: "Hybrid",
    dailyRate: 119, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
    locations: ["Berlin", "Hamburg", "Munich"], features: ["7 seats", "Navigation", "Child-seat compatible", "Cruise control"],
    accent: "#e8e0d6",
  },
];

export function findCar(id: string | undefined): Car | undefined {
  return cars.find((car) => car.id === id);
}