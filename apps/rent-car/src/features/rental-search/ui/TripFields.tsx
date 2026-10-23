import type { RentalTrip } from "@rental";
import { rentalLocations } from "@rental";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { dateOffset } from "@/shared/lib/dates";

interface TripFieldsProps {
  value: RentalTrip;
  onChange: (next: RentalTrip) => void;
  idPrefix: string;
}

export function TripFields({ value, onChange, idPrefix }: TripFieldsProps) {
  function set(field: keyof RentalTrip, next: string) {
    onChange({ ...value, [field]: next });
  }
  const places = rentalLocations.map((place) => (
    <option key={place.id} value={place.id}>{place.name}</option>
  ));
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div>
        <Label htmlFor={idPrefix + "-pickup-location"}>Pickup location</Label>
        <Select id={idPrefix + "-pickup-location"} value={value.pickupLocationId}
          onChange={(event) => set("pickupLocationId", event.target.value)}>
          {places}
        </Select>
      </div>
      <div>
        <Label htmlFor={idPrefix + "-pickup-date"}>Pickup date</Label>
        <Input required type="date" id={idPrefix + "-pickup-date"} min={dateOffset(0)}
          value={value.pickupDate} onChange={(event) => set("pickupDate", event.target.value)} />
      </div>
      <div>
        <Label htmlFor={idPrefix + "-pickup-time"}>Pickup time</Label>
        <Input required type="time" step={60} id={idPrefix + "-pickup-time"}
          value={value.pickupTime} onChange={(event) => set("pickupTime", event.target.value)} />
      </div>
      <div>
        <Label htmlFor={idPrefix + "-return-location"}>Return location</Label>
        <Select id={idPrefix + "-return-location"} value={value.returnLocationId}
          onChange={(event) => set("returnLocationId", event.target.value)}>
          {rentalLocations.map((place) => (
            <option key={place.id} value={place.id}>{place.name}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor={idPrefix + "-return-date"}>Return date</Label>
        <Input required type="date" id={idPrefix + "-return-date"} min={value.pickupDate}
          value={value.returnDate} onChange={(event) => set("returnDate", event.target.value)} />
      </div>
      <div>
        <Label htmlFor={idPrefix + "-return-time"}>Return time</Label>
        <Input required type="time" step={60} id={idPrefix + "-return-time"}
          value={value.returnTime} onChange={(event) => set("returnTime", event.target.value)} />
      </div>
      <p className="text-xs leading-5 text-muted-foreground sm:col-span-2 xl:col-span-3">
        Times are local to each location. One-way returns may involve additional charges and require confirmation.
      </p>
    </div>
  );
}
