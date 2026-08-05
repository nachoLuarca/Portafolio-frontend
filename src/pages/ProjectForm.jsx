import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout.jsx";
import FormPage from "../components/FormPage.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const empty = {
  title: "", summary: "", description: "", cover_image_url: "",
  tech_stack: "", repo_url: "", demo_url: "", featured: false, status: "published",
};

export default function ProjectForm() {
  const { id } = useParams();
  const isNew = id === "nuevo";
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    api.get("/admin/projects").then((res) => {
      const p = res.data.find((proj) => String(proj.id) === id);
      if (p) {
        setForm({ ...p, tech_stack: (p.tech_stack || []).join(", ") });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (isNew) {
        await api.post("/admin/projects", payload);
      } else {
        await api.put(`/admin/projects/${id}`, payload);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo guardar el proyecto.");
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
      title={isNew ? "Nuevo proyecto" : "Editar proyecto"}
      backTo="/admin"
      backLabel="← proyectos"
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar proyecto"
      error={error}
    >
      <div className="space-y-1.5">
        <Label htmlFor="title">Título</Label>
        <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="summary">Resumen corto (para la tarjeta del listado)</Label>
        <Input id="summary" value={form.summary} onChange={(e) => set("summary", e.target.value)} maxLength={280} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción completa</Label>
        <Textarea id="description" rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cover_image_url">URL de imagen de portada</Label>
        <Input id="cover_image_url" value={form.cover_image_url} onChange={(e) => set("cover_image_url", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tech_stack">Tecnologías (separadas por coma)</Label>
        <Input id="tech_stack" value={form.tech_stack} onChange={(e) => set("tech_stack", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="repo_url">URL del repositorio</Label>
        <Input id="repo_url" value={form.repo_url} onChange={(e) => set("repo_url", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="demo_url">URL de demo</Label>
        <Input id="demo_url" value={form.demo_url} onChange={(e) => set("demo_url", e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox checked={form.featured} onCheckedChange={(checked) => set("featured", checked === true)} />
          Destacado
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <span className="font-mono text-xs text-muted-foreground">estado:</span>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
    </FormPage>
  );
}
