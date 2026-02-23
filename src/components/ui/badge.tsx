import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "accent" | "muted";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: [
    "bg-(--color-surface)",
    "border border-(--color-border)",
    "text-(--color-text-primary)",
  ].join(" "),

  accent: [
    "bg-(--color-accent)",
    "text-white",
    "border border-transparent",
  ].join(" "),

  muted: [
    "bg-(--color-surface-raised)",
    "border border-transparent",
    "text-(--color-text-muted)",
  ].join(" "),
};

export function Badge({
  variant = "default",
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center",
        "px-2 py-0.5",
        "rounded-full",
        "text-xs font-medium tracking-wide",
        "font-sans",
        "leading-none",
        "whitespace-nowrap",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
