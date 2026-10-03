import { useId, type SelectHTMLAttributes } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Option[];
};

export function Select({ label, options, id, className = "", ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <label className="block text-sm" htmlFor={selectId}>
      <span className="mb-1.5 block font-medium">{label}</span>
      <select
        id={selectId}
        className={`w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink outline-none focus:border-ink ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
