import { Link } from "react-router-dom";

type Highlight = {
  to: string;
  title: string;
  summary: string;
  image?: string;
};

type ServiceHighlightsProps = {
  id?: string;
  title: string;
  intro: string;
  items: Highlight[];
  browseTo: string;
  browseLabel: string;
  columns?: "three" | "four";
};

export function ServiceHighlights({ id, title, intro, items, browseTo, browseLabel, columns = "three" }: ServiceHighlightsProps) {
  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">{intro}</p>
        </div>
        <Link to={browseTo} className="text-sm text-wine">
          {browseLabel}
        </Link>
      </div>
      <Link
        to={browseTo}
        className="mt-8 flex min-h-44 flex-col justify-end rounded-3xl bg-ink p-6 text-paper sm:p-8"
      >
        <p className="text-xs tracking-[0.16em] text-paper/70 uppercase">{browseLabel}</p>
        <p className="mt-2 max-w-lg font-display text-3xl sm:text-4xl">{title}</p>
      </Link>
      <div className={`mt-4 grid gap-4 ${columns === "four" ? "sm:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3"}`}>
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group overflow-hidden rounded-3xl border border-line bg-white transition hover:border-ink"
          >
            {item.image ? (
              <div className="aspect-4/3 overflow-hidden bg-sand">
                <img src={item.image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
              </div>
            ) : null}
            <div className="p-6">
              <h3 className="text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
