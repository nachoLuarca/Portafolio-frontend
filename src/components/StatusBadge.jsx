import { cn } from "@/lib/utils";

export default function StatusBadge({ active, activeLabel, inactiveLabel, className }) {
  return (
    <span className={cn("font-mono text-xs", active ? "text-success" : "text-muted-foreground", className)}>
      ● {active ? activeLabel : inactiveLabel}
    </span>
  );
}
