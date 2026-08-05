import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout.jsx";
import { Button } from "@/components/ui/button";

export default function FormPage({
  title,
  backTo,
  backLabel = "← volver",
  onSubmit,
  saving,
  submitLabel = "Guardar",
  savingLabel = "Guardando…",
  error,
  children,
}) {
  return (
    <AdminLayout>
      <div className="w-full px-4 py-8 pb-16 sm:px-8 sm:py-10">
        <Link to={backTo} className="font-mono text-[13px] text-muted-foreground">{backLabel}</Link>
        <h1 className="my-4 text-[28px]">{title}</h1>

        <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-4">{children}</div>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <div className="mt-5 flex gap-2.5">
            <Button type="submit" disabled={saving}>
              {saving ? savingLabel : submitLabel}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to={backTo}>Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
