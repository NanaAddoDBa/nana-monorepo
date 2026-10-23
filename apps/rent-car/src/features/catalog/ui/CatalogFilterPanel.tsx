import { Search, SlidersHorizontal } from "lucide-react";

import { site } from "@/shared/config/site";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";

export type FilterKey =
  | "search"
  | "category"
  | "transmission"
  | "city"
  | "maxPrice"
  | "sort";

interface CatalogFilterPanelProps {
  value: (key: FilterKey) => string;
  onChange: (key: FilterKey, value: string) => void;
  onReset: () => void;
}

const categories = ["Compact", "Sedan", "SUV", "Electric", "Performance"];

export function CatalogFilterPanel({
  value,
  onChange,
  onReset,
}: CatalogFilterPanelProps) {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold">
          <SlidersHorizontal size={18} /> Filters
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer text-sm text-primary hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-5 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <Label htmlFor="fleet-search">Search cars</Label>
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-4 text-muted-foreground"
            />
            <Input
              id="fleet-search"
              className="pl-10"
              placeholder="Name or type"
              value={value("search")}
              onChange={(event) => onChange("search", event.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="fleet-city">Pickup city</Label>
          <Select
            id="fleet-city"
            value={value("city")}
            onChange={(event) => onChange("city", event.target.value)}
          >
            <option value="">All locations</option>
            {site.locations.map((city) => (
              <option value={city} key={city}>{city}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="fleet-category">Vehicle type</Label>
          <Select
            id="fleet-category"
            value={value("category")}
            onChange={(event) => onChange("category", event.target.value)}
          >
            <option value="">All types</option>
            {categories.map((category) => (
              <option value={category} key={category}>{category}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="fleet-transmission">Transmission</Label>
          <Select
            id="fleet-transmission"
            value={value("transmission")}
            onChange={(event) => onChange("transmission", event.target.value)}
          >
            <option value="">Any transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="fleet-price">Maximum daily rate</Label>
          <Select
            id="fleet-price"
            value={value("maxPrice")}
            onChange={(event) => onChange("maxPrice", event.target.value)}
          >
            <option value="">Any rate</option>
            <option value="75">€75</option>
            <option value="100">€100</option>
            <option value="125">€125</option>
            <option value="150">€150</option>
          </Select>
        </div>
      </div>
    </aside>
  );
}
