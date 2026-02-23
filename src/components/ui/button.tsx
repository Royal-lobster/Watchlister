import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-(--color-accent) text-white",
    "hover:bg-(--color-accent-hover)",
    "active:scale-[0.98]",
    "shadow-[0_0_0_0_var(--color-accent)]",
    "hover:shadow-[0_0_16px_0_color-mix(in_srgb,var(--color-accent)_30%,transparent)]",
  ].join(" "),

  secondary: [
    "bg-(--color-surface) text-(--color-text-primary)",
    "border border-(--color-border)",
    "hover:bg-(--color-surface-raised) hover:border-(--color-border-subtle)",
    "active:scale-[0.98]",
  ].join(" "),

  ghost: [
    "bg-transparent text-(--color-text-primary)",
    "hover:bg-(--color-surface)",
    "active:scale-[0.98]",
  ].join(" "),

  danger: [
    "bg-transparent text-(--color-secondary)",
    "border border-(--color-secondary)",
    "hover:bg-(--color-secondary) hover:text-white",
    "active:scale-[0.98]",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-xs gap-1.5 tracking-wide",
  md: "h-9 px-4 text-sm gap-2 tracking-wide",
  lg: "h-11 px-6 text-base gap-2.5 tracking-wide",
};

const spinnerSizeStyles: Record<ButtonSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      children,
      className = "",
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={[
          // Base
          "relative inline-flex items-center justify-center",
          "font-medium font-sans",
          "transition-all duration-150 ease-out",
          "outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background)",
          "cursor-pointer select-none",
          // Disabled
          "disabled:opacity-40 disabled:pointer-events-none",
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // Custom
          className,
        ].join(" ")}
        {...props}
      >
        {isLoading && (
          <Spinner className={spinnerSizeStyles[size]} />
        )}
        <span
          className={[
            "inline-flex items-center gap-[inherit]",
            "transition-opacity duration-150",
            isLoading ? "opacity-60" : "opacity-100",
          ].join(" ")}
        >
          {children}
        </span>
      </button>
    );
  }
);
