import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState({ rows = 3 }) {
  return (
    <div className="space-y-3" aria-live="polite" aria-busy="true">
      <span className="sr-only">Cargando…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-18 w-full rounded-lg" />
      ))}
    </div>
  );
}
