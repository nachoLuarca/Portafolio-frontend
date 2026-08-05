import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard.jsx";
import ContactForm from "../components/ContactForm.jsx";
import Container from "../components/Container.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatRange(start, end) {
  const opts = { year: "numeric", month: "short" };
  const s = start ? new Date(start).toLocaleDateString("es-ES", opts) : "";
  const e = end ? new Date(end).toLocaleDateString("es-ES", opts) : "actualidad";
  return `${s} — ${e}`;
}

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    api.get("/profile").then((res) => setProfile(res.data)).catch(() => {});
    api.get("/projects").then((res) => setProjects(res.data.slice(0, 3))).catch(() => {});
    api.get("/experience").then((res) => setExperience(res.data)).catch(() => {});
    api.get("/education").then((res) => setEducation(res.data)).catch(() => {});
    api.get("/certifications").then((res) => setCertifications(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!profile?.headline) return;
    const full = profile.headline;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [profile?.headline]);

  return (
    <div>
      {/* Hero / Sobre mí */}
      <Container as="section" id="sobre-mi" className="pt-22 pb-14">
        <h1 className="mb-4.5 text-center text-[clamp(32px,5vw,52px)]">
          {profile?.full_name || "Tu nombre aquí"}
        </h1>
        <p className="mb-5 min-h-6 text-center font-mono text-base text-primary">
          {typed}<span className="opacity-60">▌</span>
        </p>
        <p className="mb-3 text-base break-words whitespace-normal">{profile?.bio}</p>
        {profile?.location && (
          <p className="mb-7 font-mono text-[13px]">📍 {profile.location}</p>
        )}

        <div className="flex flex-wrap gap-3">
          {profile?.github_url && (
            <Button asChild variant="outline"><a href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a></Button>
          )}
          {profile?.linkedin_url && (
            <Button asChild variant="outline"><a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a></Button>
          )}
          {profile?.email && (
            <Button asChild variant="outline"><a href={`mailto:${profile.email}`}>{profile.email}</a></Button>
          )}
          {profile?.cv_url && (
            <Button asChild><a href={profile.cv_url} target="_blank" rel="noreferrer">Descargar CV</a></Button>
          )}
        </div>

        {profile?.skills?.length > 0 && (
          <div className="mt-10">
            <div className="mb-2.5 font-mono text-xs text-muted-foreground">stack</div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Badge key={s} variant="outline" className="font-mono font-normal text-muted-foreground">{s}</Badge>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Proyectos destacados */}
      <Container as="section" id="proyectos" className="py-6 pb-16">
        <div className="mb-7 flex items-end justify-between">
          <h2 className="text-[28px]">Proyectos</h2>
          <Link to="/proyectos" className="font-mono text-[13px] text-muted-foreground">ver todos →</Link>
        </div>
        {projects.length === 0 && <p className="text-sm">Aún no hay proyectos publicados.</p>}
        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </Container>

      {/* Experiencia */}
      {experience.length > 0 && (
        <Container as="section" id="experiencia" className="py-10 pb-16">
          <h2 className="mb-7 text-[28px]">Experiencia</h2>
          <div className="border-l border-border pl-6">
            {experience.map((item) => (
              <div key={item.id} className="relative mb-7">
                <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-primary" />
                <div className="mb-1 font-mono text-xs text-muted-foreground">
                  {formatRange(item.start_date, item.end_date)}
                </div>
                <h3 className="mb-0.5 text-lg">{item.role}</h3>
                <div className="mb-2 text-sm text-primary">{item.company}{item.location ? ` · ${item.location}` : ""}</div>
                {item.description && <p className="text-sm whitespace-pre-wrap">{item.description}</p>}
              </div>
            ))}
          </div>
        </Container>
      )}

      {/* Educación */}
      {education.length > 0 && (
        <Container as="section" id="educacion" className="py-6 pb-16">
          <h2 className="mb-7 text-[28px]">Educación</h2>
          <div className="grid gap-3.5">
            {education.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-card p-5">
                <div className="mb-1 font-mono text-xs text-muted-foreground">
                  {formatRange(item.start_date, item.end_date)}
                </div>
                <h3 className="mb-0.5 text-[17px]">{item.degree}{item.field ? ` · ${item.field}` : ""}</h3>
                <div className="text-sm text-primary">{item.institution}</div>
                {item.description && <p className="mt-2 text-sm">{item.description}</p>}
              </div>
            ))}
          </div>
        </Container>
      )}

      {/* Certificaciones */}
      {certifications.length > 0 && (
        <Container as="section" id="certificaciones" className="py-6 pb-16">
          <h2 className="mb-7 text-[28px]">Certificaciones</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
            {certifications.map((c) => (
              <a
                key={c.id}
                href={c.credential_url || undefined}
                target={c.credential_url ? "_blank" : undefined}
                rel="noreferrer"
                className="block rounded-lg border border-border bg-card p-4.5 hover:border-primary"
              >
                <div className="mb-1 text-[15px]">{c.name}</div>
                <div className="font-mono text-xs text-muted-foreground">{c.issuer}</div>
                {c.issue_date && (
                  <div className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                    {new Date(c.issue_date).toLocaleDateString("es-ES", { year: "numeric", month: "short" })}
                  </div>
                )}
              </a>
            ))}
          </div>
        </Container>
      )}

      {/* Contacto */}
      <Container as="section" id="contacto" className="py-6 pb-24">
        <h2 className="mb-7 text-[28px]">Contacto</h2>
        <ContactForm />
      </Container>
    </div>
  );
}
