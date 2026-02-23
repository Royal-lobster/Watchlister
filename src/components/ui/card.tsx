import { HTMLAttributes, forwardRef } from "react";

// ---------------------------------------------------------------------------
// Card — dark surface container with subtle lift on hover
// ---------------------------------------------------------------------------

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Disable the hover lift + shadow effect */
  static?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { static: isStatic = false, className = "", children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={[
        "bg-(--color-surface)",
        "border border-(--color-border)",
        "rounded-(--radius-lg)",
        "transition-all duration-200 ease-out",
        !isStatic && [
          "hover:-translate-y-0.5",
          "hover:shadow-[var(--shadow-card)]",
          "hover:border-(--color-border-subtle)",
        ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "px-5 pt-5 pb-4",
        "border-b border-(--color-border)",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["px-5 py-4", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "px-5 pt-4 pb-5",
        "border-t border-(--color-border)",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
