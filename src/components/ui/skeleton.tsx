import { CSSProperties } from "react";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-(--color-surface-raised) ${className ?? ""}`}
      style={style}
    />
  );
}
