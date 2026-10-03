import { useId, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label className="block text-sm" htmlFor={inputId}>
      <span className="mb-1.5 block font-medium">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink outline-none focus:border-ink ${className}`}
        {...props}
      />
      {error ? <span className="mt-1 block text-wine">{error}</span> : null}
    </label>
  );
}
