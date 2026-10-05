export type ServiceOffer = {
  slug: string;
  title: string;
  summary: string;
  details: string[];
};

export const eventOffers: ServiceOffer[] = [
  {
    slug: "weddings",
    title: "Weddings",
    summary: "Planning, vendors, and the run of the day for a wedding that stays coherent.",
    details: [
      "Timeline, vendor coordination, and guest flow.",
      "Decoration and logistics can be included or kept separate.",
      "Share the date, city, and guest count to request a quote.",
    ],
  },
  {
    slug: "anniversaries",
    title: "Anniversaries",
    summary: "Smaller celebrations with the same care for setting, food, and timing.",
    details: [
      "Private dinners, family gatherings, and milestone evenings.",
      "A starting brief is enough. We expand it into a plan.",
      "Quotes follow the venue, date, and number of guests.",
    ],
  },
  {
    slug: "private-parties",
    title: "Private parties",
    summary: "Birthdays and private gatherings, indoors or at a venue you already have.",
    details: [
      "Theme, catering coordination, and a schedule for the evening.",
      "We work with the space you choose.",
      "Guest count and city help us price the work.",
    ],
  },
  {
    slug: "event-planning",
    title: "Event planning",
    summary: "End-to-end planning when you want one team responsible for the sequence.",
    details: [
      "Brief, budget, suppliers, and the day-of run sheet.",
      "Useful when several vendors need a single point of contact.",
      "The plan is quoted before work begins.",
    ],
  },
  {
    slug: "decoration",
    title: "Decoration",
    summary: "Floral, stage, and room decoration matched to the event rather than a template.",
    details: [
      "Concept, materials, and installation on the day.",
      "Can stand alone or sit inside a larger plan.",
      "Venue photographs help us quote accurately.",
    ],
  },
  {
    slug: "logistics",
    title: "Logistics",
    summary: "Movement of guests, goods, and equipment so the event starts on time.",
    details: [
      "Transport, load-in, and coordination with the venue.",
      "Scheduled around the planning and decoration teams.",
      "Share the venue city and the scale of the move.",
    ],
  },
];

export function findOffer(offers: ServiceOffer[], slug: string | undefined) {
  return offers.find((offer) => offer.slug === slug);
}
