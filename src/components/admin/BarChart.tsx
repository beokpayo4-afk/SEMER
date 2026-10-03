type Point = {
  label: string;
  value: number;
  caption: string;
};

export function BarChart({ title, points }: { title: string; points: Point[] }) {
  const peak = Math.max(1, ...points.map((point) => point.value));
  return (
    <figure className="rounded-3xl border border-line bg-white p-5">
      <figcaption className="text-lg">{title}</figcaption>
      <div className="mt-4 flex h-40 items-end gap-2">
        {points.map((point) => (
          <div key={point.label} className="flex min-w-0 flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-[11px] text-muted">{point.caption}</span>
            <div
              className="w-full rounded-t bg-wine"
              style={{ height: `${Math.max(4, (point.value / peak) * 100)}%` }}
              title={point.caption}
            />
            <span className="mt-2 truncate text-[11px] text-muted">{point.label}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
