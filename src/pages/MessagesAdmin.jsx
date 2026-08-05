import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import api from "../api/axios";
import { Button } from "@/components/ui/button";

export default function MessagesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get("/admin/messages").then((res) => setItems(res.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function handleRead(id) {
    await api.patch(`/admin/messages/${id}/leido`);
    load();
  }

  async function handleDelete() {
    const id = pendingDelete;
    setPendingDelete(null);
    await api.delete(`/admin/messages/${id}`);
    load();
  }

  const unreadCount = items.filter((m) => !m.is_read).length;

  return (
    <AdminLayout>
      <div className="w-full px-4 py-8 pb-16 sm:px-8 sm:py-10">
        <PageHeader
          title="Mensajes"
          description={unreadCount > 0 ? `${unreadCount} sin leer` : "todo al día"}
        />

        {loading && <LoadingState />}
        {!loading && items.length === 0 && <EmptyState title="No has recibido mensajes todavía." />}

        {items.map((m) => (
          <div key={m.id} className="mb-2.5 rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <StatusBadge active={!m.is_read} activeLabel="nuevo" inactiveLabel="leído" />
                <strong className="ml-2.5 font-display">{m.name}</strong>
                <span className="ml-2 text-sm text-muted-foreground">&lt;{m.email}&gt;</span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {new Date(m.created_at).toLocaleString("es-ES")}
              </span>
            </div>
            {m.subject && <div className="mb-1.5 text-sm text-foreground">{m.subject}</div>}
            <p className="mb-3.5 text-sm whitespace-pre-wrap">{m.body}</p>
            <div className="flex flex-wrap gap-2">
              {!m.is_read && <Button variant="outline" onClick={() => handleRead(m.id)}>marcar leído</Button>}
              <Button asChild variant="outline">
                <a href={`mailto:${m.email}`}>responder</a>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setPendingDelete(m.id)}
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
          title="¿Eliminar este mensaje?"
          description="Esta acción no se puede deshacer."
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
