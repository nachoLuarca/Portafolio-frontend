import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingState from "../components/LoadingState.jsx";

export default function ProfileEdit() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/profile").then((res) => setForm({ ...res.data, skills: (res.data.skills || []).join(", ") }));
  }, []);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) };
    await api.put("/admin/profile", payload);
    setSaving(false);
    setSaved(true);
  }

  if (!form) {
    return (
      <AdminLayout>
        <div className="w-full px-4 py-8 sm:px-8 sm:py-10">
          <LoadingState rows={4} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full px-4 py-8 pb-16 sm:px-8 sm:py-10">
        <Link to="/admin" className="font-mono text-[13px] text-muted-foreground">← panel</Link>
        <h1 className="my-4 text-[28px]">Editar perfil</h1>

        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input id="full_name" value={form.full_name || ""} onChange={(e) => set("full_name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="headline">Titular / rol profesional</Label>
              <Input id="headline" value={form.headline || ""} onChange={(e) => set("headline", e.target.value)} placeholder="Desarrollador Full Stack" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea id="bio" rows={5} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email de contacto</Label>
              <Input id="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" value={form.location || ""} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="avatar_url">URL de avatar</Label>
              <Input id="avatar_url" value={form.avatar_url || ""} onChange={(e) => set("avatar_url", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="github_url">GitHub</Label>
              <Input id="github_url" value={form.github_url || ""} onChange={(e) => set("github_url", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input id="linkedin_url" value={form.linkedin_url || ""} onChange={(e) => set("linkedin_url", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cv_url">URL del CV</Label>
              <Input id="cv_url" value={form.cv_url || ""} onChange={(e) => set("cv_url", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
              <Input id="skills" value={form.skills || ""} onChange={(e) => set("skills", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
            {saved && <span className="font-mono text-[13px] text-success">✓ guardado</span>}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
