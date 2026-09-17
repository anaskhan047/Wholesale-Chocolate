import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm" | "xs";
};

export const buttonVariants = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60",
  secondary:
    "bg-secondary text-secondary-foreground hover:opacity-90 disabled:opacity-60",
  ghost:
    "border border-border bg-card text-foreground hover:border-ring disabled:opacity-60",
};

export function buttonClass(
  variant: keyof typeof buttonVariants = "primary",
  size: "md" | "sm" | "xs" = "md",
) {
  const sizing =
    size === "xs"
      ? "h-7 w-full px-1.5 text-[10px] leading-none sm:h-9 sm:w-auto sm:px-3 sm:text-xs"
      : size === "sm"
        ? "h-9 w-auto px-3 text-xs sm:text-sm"
        : "h-11 w-full px-4 text-sm sm:text-base";

  return `inline-flex items-center justify-center rounded-xl text-center font-semibold transition ${sizing} ${buttonVariants[variant]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonClass(variant, size)} ${className}`}
      {...props}
    />
  );
}
