import type { FormEvent } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
};

export function SearchBar({ value, onChange, onSubmit, className = "" }: SearchBarProps) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={submit} className={`flex gap-2 ${className}`} role="search">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-ink"
      />
      <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm text-paper">
        Search
      </button>
    </form>
  );
}
