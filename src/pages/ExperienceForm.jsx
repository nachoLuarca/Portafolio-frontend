import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout.jsx";
import FormPage from "../components/FormPage.jsx";
import LoadingState from "../components/LoadingState.jsx";
import api from "../api/axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const empty = { company: "", role: "", location: "", start_date: "", end_date: "", description: "" };

export default function ExperienceForm() {
  const { id } = useParams();
  const isNew = id === "nuevo";
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [showCurrent, setShowCurrent] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    api.get("/experience").then((res) => {
      const item = res.data.find((i) => String(i.id) === id);
      if (item) {
        setShowCurrent(!item.end_date);
        setForm({
          company: item.company, role: item.role, location: item.location,
          start_date: item.start_date?.slice(0, 10) || "",
          end_date: item.end_date?.slice(0, 10) || "",
          description: item.description,
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
    const payload = { ...form, end_date: showCurrent ? null : form.end_date || null };
    try {
      if (isNew) {
        await api.post("/admin/experience", payload);
      } else {
        await api.put(`/admin/experience/${id}`, payload);
      }
      navigate("/admin/experiencia");
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
      title={isNew ? "Nueva experiencia" : "Editar experiencia"}
      backTo="/admin/experiencia"
      backLabel="← experiencia"
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar experiencia"
      error={error}
    >
      <div className="space-y-1.5"><Label htmlFor="company">Empresa</Label><Input id="company" value={form.company} onChange={(e) => set("company", e.target.value)} required /></div>
      <div className="space-y-1.5"><Label htmlFor="role">Cargo</Label><Input id="role" value={form.role} onChange={(e) => set("role", e.target.value)} required /></div>
      <div className="space-y-1.5"><Label htmlFor="location">Ubicación</Label><Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-1.5"><Label htmlFor="start_date">Inicio</Label><Input id="start_date" type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} required /></div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="end_date">Fin</Label>
          <Input id="end_date" type="date" value={form.end_date} disabled={showCurrent} onChange={(e) => set("end_date", e.target.value)} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Checkbox checked={showCurrent} onCheckedChange={(checked) => setShowCurrent(checked === true)} />
        Trabajo actual
      </label>
      <div className="space-y-1.5"><Label htmlFor="description">Descripción</Label><Textarea id="description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
    </FormPage>
  );
}
