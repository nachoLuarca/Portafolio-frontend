import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get("/admin/projects").then((res) => setProjects(res.data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    const id = pendingDelete;
    setPendingDelete(null);
    await api.delete(`/admin/projects/${id}`);
    load();
  }

  return (
    <AdminLayout>
      <div className="w-full px-4 py-8 pb-16 sm:px-8 sm:py-10">
        <PageHeader
          title="Proyectos"
          action={
            <Button asChild>
              <Link to="/admin/proyectos/nuevo"><Plus className="size-4" /> nuevo proyecto</Link>
            </Button>
          }
        />

        {loading && <LoadingState />}
        {!loading && projects.length === 0 && (
          <EmptyState title="No hay proyectos todavía." description="Creá el primero con el botón de arriba." />
        )}

        {projects.map((p) => (
          <div key={p.id} className="mb-3 flex flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2.5">
                <StatusBadge active={p.status === "published"} activeLabel="publicado" inactiveLabel="borrador" />
                {p.featured && (
                  <Badge variant="outline" className="border-primary font-mono font-normal text-primary">destacado</Badge>
                )}
              </div>
              <strong className="font-display text-[17px]">{p.title}</strong>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button asChild variant="outline" size="icon">
                <Link to={`/admin/proyectos/${p.id}`} aria-label="Editar" title="Editar">
                  <Pencil className="size-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setPendingDelete(p.id)}
                aria-label="Eliminar"
                title="Eliminar"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        <ConfirmDialog
          open={pendingDelete !== null}
          onOpenChange={(open) => !open && setPendingDelete(null)}
          title="¿Eliminar este proyecto?"
          description="Esta acción no se puede deshacer."
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
