import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout.jsx";
import FormPage from "../components/FormPage.jsx";
import LoadingState from "../components/LoadingState.jsx";
import api from "../api/axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const empty = { name: "", issuer: "", issue_date: "", credential_url: "" };

export default function CertificationsForm() {
  const { id } = useParams();
  const isNew = id === "nuevo";
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    api.get("/certifications").then((res) => {
      const item = res.data.find((i) => String(i.id) === id);
      if (item) {
        setForm({
          name: item.name, issuer: item.issuer,
          issue_date: item.issue_date?.slice(0, 10) || "",
          credential_url: item.credential_url,
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        await api.post("/admin/certifications", form);
      } else {
        await api.put(`/admin/certifications/${id}`, form);
      }
      navigate("/admin/certificaciones");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="w-full px-4 py-8 sm:px-8 sm:py-10">
          <LoadingState rows={4} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <FormPage
      title={isNew ? "Nueva certificación" : "Editar certificación"}
      backTo="/admin/certificaciones"
      backLabel="← certificaciones"
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar certificación"
      error={error}
    >
      <div className="space-y-1.5"><Label htmlFor="name">Nombre</Label><Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
      <div className="space-y-1.5"><Label htmlFor="issuer">Emisor</Label><Input id="issuer" value={form.issuer} onChange={(e) => set("issuer", e.target.value)} required /></div>
      <div className="space-y-1.5"><Label htmlFor="issue_date">Fecha de emisión</Label><Input id="issue_date" type="date" value={form.issue_date} onChange={(e) => set("issue_date", e.target.value)} /></div>
      <div className="space-y-1.5"><Label htmlFor="credential_url">URL de la credencial</Label><Input id="credential_url" value={form.credential_url} onChange={(e) => set("credential_url", e.target.value)} placeholder="https://…" /></div>
    </FormPage>
  );
}
