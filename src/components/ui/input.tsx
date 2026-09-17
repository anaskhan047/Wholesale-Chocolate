import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <label className="block w-full min-w-0" htmlFor={id}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input
        id={id}
        className={`h-11 w-full min-w-0 rounded-xl border border-border bg-input px-3 text-sm text-foreground outline-none ring-ring placeholder:text-muted-foreground focus:ring-2 sm:text-base ${className}`}
        {...props}
      />
    </label>
  );
}
