import type { Car } from "../../../entities/car/model/cars.ts";

export interface CatalogFilters {
  search: string;
  category: string;
  transmission: string;
  city: string;
  sort: string;
  maxPrice: number | null;
}

export const defaultFilters: CatalogFilters = {
  search: "",
  category: "",
  transmission: "",
  city: "",
  sort: "featured",
  maxPrice: null,
};

export function filterCars(items: Car[], filters: CatalogFilters): Car[] {
  const query = filters.search.trim().toLowerCase();

  const matches = items.filter((car) => {
    const matchesSearch = !query || [
      car.name,
      car.category,
      car.summary,
      car.fuel,
    ].some((field) => field.toLowerCase().includes(query));

    return (
      matchesSearch &&
      (!filters.category || car.category === filters.category) &&
      (!filters.transmission || car.transmission === filters.transmission) &&
      (!filters.city || car.locations.includes(filters.city)) &&
      (filters.maxPrice === null || car.dailyRate <= filters.maxPrice)
    );
  });

  return matches.sort((a, b) => {
    if (filters.sort === "price-low") return a.dailyRate - b.dailyRate;
    if (filters.sort === "price-high") return b.dailyRate - a.dailyRate;
    if (filters.sort === "seats") return b.seats - a.seats;
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });
}
