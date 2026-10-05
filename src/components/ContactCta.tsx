import { Link } from "react-router-dom";

export function ContactCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="rounded-3xl bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12 md:flex md:items-center md:justify-between md:gap-10">
        <div>
          <h2 className="text-3xl text-paper sm:text-4xl">Get in touch</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-paper/80 sm:text-base">
            Ask about a product. Send the details from the contact page and the team can reply.
          </p>
        </div>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition duration-200 hover:-translate-y-px hover:bg-white md:mt-0"
        >
          Contact us
        </Link>
      </div>
    </section>
  );
}
