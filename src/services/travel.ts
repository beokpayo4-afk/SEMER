import { api } from "./api.ts";

export type TravelCategory = "domestic" | "international" | "holiday" | "honeymoon" | "customized";

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

export async function listTravel(query: TravelQuery = {}) {
  const { data } = await api.get<TravelPackagePage>("/api/travel", { params: query });
  return data;
}

export async function getTravelPackage(packageId: string) {
  const { data } = await api.get<TravelPackage>(`/api/travel/${packageId}`);
  return data;
}

export async function submitTravelEnquiry(input: TravelEnquiryInput) {
  const { data } = await api.post<{ id: string }>("/api/travel/enquiries", input);
  return data;
}
