import { ContactCta } from "../components/ContactCta.tsx";
import { Hero } from "../components/Hero.tsx";
import { ProductSection } from "../components/ProductSection.tsx";
import { Reveal } from "../components/Reveal.tsx";
import { WhyChooseUs } from "../components/WhyChooseUs.tsx";
import { usePageTitle } from "../hooks/usePageTitle.ts";

export function HomePage() {
  usePageTitle("Home");

  return (
    <div>
      <Hero />
      <WhyChooseUs />
      <Reveal>
        <ProductSection
          title="Beauty & Personal Care"
          intro="Cosmetics, skincare, haircare, perfumes, toiletries, and personal care."
          categoryLabel="Beauty & Personal Care"
          subcategories={["Cosmetics", "Skincare", "Haircare", "Perfumes", "Toiletries", "Personal Care"]}
          tone="sand"
        />
      </Reveal>
      <Reveal>
        <ProductSection
          title="Fashion"
          intro="Clothing, footwear, jewellery, bags, watches, and accessories."
          categoryLabel="Fashion"
          subcategories={["Clothing", "Footwear", "Jewellery", "Bags", "Watches", "Fashion Accessories"]}
        />
      </Reveal>
      <Reveal>
        <ContactCta />
      </Reveal>
    </div>
  );
}
