export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-(--color-surface-raised) ${className ?? ""}`}
    />
  );
}
