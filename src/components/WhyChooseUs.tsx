import { Reveal } from "./Reveal.tsx";

const points = [
  {
    title: "One catalogue",
    text: "Browse beauty, fashion, and lifestyle from one catalogue.",
  },
  {
    title: "Prices from the catalogue",
    text: "Product prices are shown in rupees, including a sale price when one is set.",
  },
  {
    title: "An account for orders",
    text: "Checkout asks you to sign in so a product order stays with your account.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {points.map((point, index) => (
          <Reveal key={point.title} delay={index * 90}>
            <p className="text-xs tracking-[0.18em] text-wine">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 text-base">{point.title}</h2>
            <span className="rule-grow mt-3 block h-px w-10 bg-wine/70" />
            <p className="mt-3 text-sm leading-6 text-muted">{point.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
