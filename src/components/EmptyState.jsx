import { Inbox } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <Inbox className="mx-auto mb-3 size-8 text-muted-foreground/60" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{title}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
