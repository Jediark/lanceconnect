import { Search } from "lucide-react";
import { CATEGORIES } from "@/data/mockData";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="flex flex-1 items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search leads by business name..."
          className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Search
      </button>
    </form>
  );
}

interface CategoryPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
    >
      <option value="">All Categories</option>
      {CATEGORIES.map((c) => (
        <option key={c.id} value={c.id}>
          {c.emoji} {c.label}
        </option>
      ))}
    </select>
  );
}

interface LocationPickerProps {
  country: string;
  city: string;
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

export function LocationPicker({ country, city, onCountryChange, onCityChange }: LocationPickerProps) {
  const COUNTRIES = [
    { code: "NG", flag: "🇳🇬", name: "Nigeria" },
    { code: "IT", flag: "🇮🇹", name: "Italy" },
    { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
    { code: "AR", flag: "🇦🇷", name: "Argentina" },
    { code: "IN", flag: "🇮🇳", name: "India" },
    { code: "CA", flag: "🇨🇦", name: "Canada" },
    { code: "FR", flag: "🇫🇷", name: "France" },
    { code: "MY", flag: "🇲🇾", name: "Malaysia" },
    { code: "US", flag: "🇺🇸", name: "United States" },
  ];

  return (
    <div className="flex gap-2">
      <select
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">All Countries</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.name}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>
      <input
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        placeholder="Any city..."
        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}