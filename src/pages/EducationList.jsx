import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout.jsx";
import PageHeader from "../components/PageHeader.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import api from "../api/axios";
import { Button } from "@/components/ui/button";

export default function EducationList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get("/education").then((res) => setItems(res.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    const id = pendingDelete;
    setPendingDelete(null);
    await api.delete(`/admin/education/${id}`);
    load();
  }

  return (
    <AdminLayout>
      <div className="w-full px-4 py-8 pb-16 sm:px-8 sm:py-10">
        <PageHeader
          title="Educación"
          action={
            <Button asChild>
              <Link to="/admin/educacion/nuevo">+ nueva educación</Link>
            </Button>
          }
        />

        {loading && <LoadingState />}
        {!loading && items.length === 0 && (
          <EmptyState title="Sin registros todavía." description="Creá el primero con el botón de arriba." />
        )}
        {items.map((item) => (
          <div key={item.id} className="mb-2.5 flex flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <strong className="font-display">{item.degree}</strong> — {item.institution}
              <div className="font-mono text-xs text-muted-foreground">
                {item.start_date?.slice(0, 10)} → {item.end_date ? item.end_date.slice(0, 10) : "en curso"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to={`/admin/educacion/${item.id}`}>editar</Link>
              </Button>
              <Button variant="destructive" onClick={() => setPendingDelete(item.id)}>eliminar</Button>
            </div>
          </div>
        ))}

        <ConfirmDialog
          open={pendingDelete !== null}
          onOpenChange={(open) => !open && setPendingDelete(null)}
          title="¿Eliminar este registro de educación?"
          description="Esta acción no se puede deshacer."
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
