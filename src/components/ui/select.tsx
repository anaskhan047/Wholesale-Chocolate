import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
};

export function Select({
  label,
  id,
  options,
  placeholder = "Select",
  className = "",
  ...props
}: SelectProps) {
  return (
    <label className="block w-full min-w-0" htmlFor={id}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <select
        id={id}
        className={`h-11 w-full min-w-0 rounded-xl border border-border bg-input px-3 text-sm text-foreground outline-none ring-ring focus:ring-2 sm:text-base ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
