import { api } from "./api.ts";

export type EventCategory =
  | "wedding"
  | "anniversary"
  | "private_party"
  | "planning"
  | "decoration"
  | "logistics";

export type EventImage = {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
};

export type EventService = {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  description: string;
  services: string;
  images: EventImage[];
  status: "draft" | "active" | "archived";
  featured: boolean;
};

export type EventServicePage = {
  items: EventService[];
  page: number;
  page_size: number;
  total: number;
};

export type EventQuery = {
  category?: EventCategory;
  featured?: boolean;
  page?: number;
  page_size?: number;
};

export type EventEnquiryInput = {
  service_id?: string;
  name: string;
  email: string;
  phone: string;
  event_type: EventCategory;
  event_date: string;
  location: string;
  expected_guests: number;
  budget: number;
  requirements: string;
  message: string;
};

export const eventCategories: { value: EventCategory; label: string; summary: string }[] = [
  {
    value: "wedding",
    label: "Weddings",
    summary: "Planning, vendors, and the run of the day for a wedding that stays coherent.",
  },
  {
    value: "anniversary",
    label: "Anniversaries",
    summary: "Smaller celebrations with the same care for setting, food, and timing.",
  },
  {
    value: "private_party",
    label: "Private Parties",
    summary: "Birthdays and private gatherings, indoors or at a venue you already have.",
  },
  {
    value: "planning",
    label: "Event Planning",
    summary: "End-to-end planning when you want one team responsible for the sequence.",
  },
  {
    value: "decoration",
    label: "Decoration",
    summary: "Floral, stage, and room decoration matched to the event rather than a template.",
  },
  {
    value: "logistics",
    label: "Logistics",
    summary: "Movement of guests, goods, and equipment so the event starts on time.",
  },
];

export function eventCategoryLabel(category: EventCategory) {
  return eventCategories.find((item) => item.value === category)?.label ?? category;
}

export async function listEvents(query: EventQuery = {}) {
  const { data } = await api.get<EventServicePage>("/api/events", { params: query });
  return data;
}

export async function getEventService(serviceId: string) {
  const { data } = await api.get<EventService>(`/api/events/${serviceId}`);
  return data;
}

export async function submitEventEnquiry(input: EventEnquiryInput) {
  const { data } = await api.post<{ id: string }>("/api/events/enquiries", input);
  return data;
}
