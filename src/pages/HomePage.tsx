import { ContactCta } from "../components/ContactCta.tsx";
import { Hero } from "../components/Hero.tsx";
import { ProductSection } from "../components/ProductSection.tsx";
import { ServiceHighlights } from "../components/ServiceHighlights.tsx";
import { WhyChooseUs } from "../components/WhyChooseUs.tsx";
import { eventOffers, travelOffers } from "../content/services.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";

const travelItems = [
  { slug: "domestic", title: "Domestic Trips", category: "domestic", image: "/images/travel/domestic.jpg" },
  { slug: "international", title: "International Trips", category: "international", image: "/images/travel/international.png" },
  { slug: "holiday-packages", title: "Holiday Packages", category: "holiday", image: "/images/travel/holiday.jpg" },
  { slug: "honeymoon-packages", title: "Honeymoon Packages", category: "honeymoon", image: "/images/travel/honeymoon.png" },
];

const eventItems = [
  { slug: "weddings", title: "Weddings", category: "wedding", image: "/images/events/wedding.jpg" },
  { slug: "anniversaries", title: "Anniversaries", category: "anniversary", image: "/images/events/anniversary.jpg" },
  { slug: "private-parties", title: "Private Parties", category: "private_party", image: "/images/events/private-party.jpg" },
  { slug: "event-planning", title: "Event Planning", category: "planning", image: "/images/events/planning.png" },
  { slug: "decoration", title: "Decoration", category: "decoration", image: "/images/events/decoration.jpg" },
  { slug: "logistics", title: "Logistics", category: "logistics", image: "/images/events/logistics.png" },
];

export function HomePage() {
  usePageTitle("Home");

  return (
    <div className="home-open">
      <Hero />
      <WhyChooseUs />
      <ProductSection
        title="Beauty & Personal Care"
        intro="Cosmetics, skincare, haircare, perfumes, toiletries, and personal care."
        categoryLabel="Beauty & Personal Care"
        subcategories={["Cosmetics", "Skincare", "Haircare", "Perfumes", "Toiletries", "Personal Care"]}
        tone="sand"
      />
      <ProductSection
        title="Fashion"
        intro="Clothing, footwear, jewellery, bags, watches, and accessories."
        categoryLabel="Fashion"
        subcategories={["Clothing", "Footwear", "Jewellery", "Bags", "Watches", "Fashion Accessories"]}
      />
      <ServiceHighlights
        id="services"
        title="Travel Services"
        intro="Domestic trips, international trips, holiday packages, and honeymoon packages. Each one is quoted before it is booked."
        items={travelItems.flatMap((item) => {
          const offer = travelOffers.find((entry) => entry.slug === item.slug);
          return offer ? [{ to: `/travel?category=${item.category}`, title: item.title, summary: offer.summary, image: item.image }] : [];
        })}
        browseTo="/travel"
        browseLabel="All travel"
        columns="four"
      />
      <ServiceHighlights
        title="Event Management"
        intro="Weddings, anniversaries, private parties, planning, decoration, and logistics. Each one is quoted before it is booked."
        items={eventItems.flatMap((item) => {
          const offer = eventOffers.find((entry) => entry.slug === item.slug);
          return offer ? [{ to: `/events?category=${item.category}`, title: item.title, summary: offer.summary, image: item.image }] : [];
        })}
        browseTo="/events"
        browseLabel="All events"
      />
      <ContactCta />
    </div>
  );
}
