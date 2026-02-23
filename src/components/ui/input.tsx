import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

// ---------------------------------------------------------------------------
// Input — styled dark input, extends all native <input> props
// No "use client" needed — purely presentational
// ---------------------------------------------------------------------------

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional node rendered to the left of the input text */
  leftIcon?: ReactNode;
  /** Additional class applied to the outer wrapper div */
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, wrapperClassName = "", className = "", ...props },
  ref
) {
  return (
    <div className={["relative flex items-center", wrapperClassName].join(" ")}>
      {/* Left icon slot */}
      {leftIcon && (
        <span
          className={[
            "absolute left-3",
            "flex items-center justify-center",
            "text-(--color-text-muted)",
            "pointer-events-none select-none",
            "size-4",
          ].join(" ")}
          aria-hidden="true"
        >
          {leftIcon}
        </span>
      )}

      <input
        ref={ref}
        className={[
          // Layout
          "w-full h-9",
          leftIcon ? "pl-9 pr-3" : "px-3",
          // Appearance
          "bg-(--color-surface)",
          "border border-(--color-border)",
          "rounded-(--radius-md)",
          "text-sm font-sans text-(--color-text-primary)",
          "placeholder:text-(--color-text-muted)",
          // Transition
          "transition-[border-color,box-shadow] duration-150 ease-out",
          // Focus — red ring matching accent
          "outline-none",
          "focus:border-(--color-accent)",
          "focus:ring-2 focus:ring-(--color-accent)/25",
          // Disabled
          "disabled:opacity-40 disabled:cursor-not-allowed",
          // File input reset
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className,
        ].join(" ")}
        {...props}
      />
    </div>
  );
});
