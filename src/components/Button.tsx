import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-wine text-paper hover:bg-wine-dark",
  secondary: "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:bg-sand",
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
