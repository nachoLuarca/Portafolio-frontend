import { useState } from "react";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", body: "", website: "" });
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.error || "No se pudo enviar el mensaje.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-border bg-card p-7 text-center">
        <p className="mb-2 font-mono text-success">✓ mensaje enviado</p>
        <p className="text-sm">Gracias por escribir. Te responderé lo antes posible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6">
      {/* Honeypot: campo oculto para bots, invisible para personas */}
      <input
        type="text"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
        tabIndex="-1"
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
        aria-hidden="true"
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cf-name">Nombre</Label>
          <Input id="cf-name" value={form.name} onChange={(e) => set("name", e.target.value)} required maxLength={160} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf-email">Email</Label>
          <Input id="cf-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        </div>
      </div>
      <div className="mb-4 space-y-1.5">
        <Label htmlFor="cf-subject">Asunto</Label>
        <Input id="cf-subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} maxLength={200} />
      </div>
      <div className="mb-4 space-y-1.5">
        <Label htmlFor="cf-body">Mensaje</Label>
        <Textarea id="cf-body" rows={5} value={form.body} onChange={(e) => set("body", e.target.value)} required maxLength={4000} />
      </div>
      {status === "error" && <p className="mb-3.5 text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </Button>
    </form>
  );
}
