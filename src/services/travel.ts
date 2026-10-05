import { api } from "./api.ts";

export type TravelCategory = "domestic" | "international" | "holiday" | "honeymoon" | "customized";

export type PackageType = "domestic" | "international";

export type PackageCategory =
  | "holiday"
  | "honeymoon"
  | "family"
  | "adventure"
  | "beach"
  | "luxury"
  | "pilgrimage"
  | "group";

export type TravelImage = {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
};

export type TravelPackage = {
  id: string;
  title: string;
  slug: string;
  category: TravelCategory;
  package_type: PackageType;
  package_category: PackageCategory | null;
  destination: string;
  country: string;
  duration: number;
  starting_price: number;
  description: string;
  itinerary: string;
  accommodation: string;
  transportation: string;
  activities: string;
  inclusions: string;
  exclusions: string;
  romantic_highlights: string;
  hotel_category: string;
  room_type: string;
  couple_experiences: string;
  honeymoon_inclusions: string;
  images: TravelImage[];
  status: "draft" | "active" | "archived";
  featured: boolean;
};

export type TravelPackagePage = {
  items: TravelPackage[];
  page: number;
  page_size: number;
  total: number;
};

export type TravelQuery = {
  category?: TravelCategory;
  package_type?: PackageType;
  package_category?: PackageCategory;
  featured?: boolean;
  page?: number;
  page_size?: number;
};

export type TravelEnquiryInput = {
  package_id?: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travel_date: string;
  travelers: number;
  budget: number;
  message: string;
};

export const travelCategories: { value: TravelCategory; label: string; summary: string }[] = [
  {
    value: "domestic",
    label: "Domestic Trips",
    summary: "City breaks and regional journeys across India, planned around the way you like to travel.",
  },
  {
    value: "international",
    label: "International Trips",
    summary: "Outbound travel with flights, stays, and a day-by-day plan built for your group.",
  },
  {
    value: "holiday",
    label: "Holiday Packages",
    summary: "Ready holiday shapes for families and groups, with room to adjust nights and hotels.",
  },
  {
    value: "honeymoon",
    label: "Honeymoon Packages",
    summary: "Trips arranged for two, with stays and a pace set around the couple.",
  },
  {
    value: "customized",
    label: "Customized Trips",
    summary: "A trip drawn around your dates, budget, and the people travelling with you.",
  },
];

export function travelCategoryLabel(category: TravelCategory) {
  return travelCategories.find((item) => item.value === category)?.label ?? category;
}

export const packageCategories: { value: PackageCategory; label: string }[] = [
  { value: "holiday", label: "Holiday" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family", label: "Family" },
  { value: "adventure", label: "Adventure" },
  { value: "beach", label: "Beach" },
  { value: "luxury", label: "Luxury" },
  { value: "pilgrimage", label: "Pilgrimage" },
  { value: "group", label: "Group" },
];

export function travelDurationLabel(days: number, category?: TravelCategory) {
  if (category === "international" || category === "honeymoon") {
    const nights = Math.max(days - 1, 0);
    const dayLabel = days === 1 ? "Day" : "Days";
    const nightLabel = nights === 1 ? "Night" : "Nights";
    return `${days} ${dayLabel} / ${nights} ${nightLabel}`;
  }
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function travelPlaceLabel(destination: string, country: string, category?: TravelCategory) {
  if (
    (category === "international" || category === "honeymoon") &&
    destination.toLowerCase().includes(country.toLowerCase())
  ) {
    return destination;
  }
  return `${destination}, ${country}`;
}

export async function listTravel(query: TravelQuery = {}) {
  const { data } = await api.get<TravelPackagePage>("/api/travel", { params: query });
  return data;
}

export async function getTravelPackage(packageId: string) {
  const { data } = await api.get<TravelPackage>(`/api/travel/${packageId}`);
  return data;
}

export async function getTravelPackageBySlug(slug: string) {
  const { data } = await api.get<TravelPackage>(`/api/travel/by-slug/${slug}`);
  return data;
}

export async function submitTravelEnquiry(input: TravelEnquiryInput) {
  const { data } = await api.post<{ id: string }>("/api/travel/enquiries", input);
  return data;
}
