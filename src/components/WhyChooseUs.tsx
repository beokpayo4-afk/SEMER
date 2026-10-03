const points = [
  {
    title: "Products and services together",
    text: "Browse the catalogue, then ask about a trip or an event from the same site.",
  },
  {
    title: "Prices from the catalogue",
    text: "Product prices are shown in rupees, including a sale price when one is set.",
  },
  {
    title: "Quotes before bookings",
    text: "Travel and events are planned from an enquiry and confirmed with a quote.",
  },
  {
    title: "An account for orders",
    text: "Checkout asks you to sign in so a product order stays with your account.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {points.map((point) => (
          <article key={point.title}>
            <h2 className="text-base">{point.title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">{point.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
