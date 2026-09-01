import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard.jsx";
import ContactForm from "../components/ContactForm.jsx";
import Container from "../components/Container.jsx";
import LoadingState from "../components/LoadingState.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { Button } from "@/components/ui/button";
import { recordStagger, recordRow } from "@/lib/motion";

function formatRange(start, end) {
  const opts = { year: "numeric", month: "short" };
  const s = start ? new Date(start).toLocaleDateString("es-ES", opts) : "";
  const e = end ? new Date(end).toLocaleDateString("es-ES", opts) : "actualidad";
  return `${s} — ${e}`;
}

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    api.get("/profile").then((res) => setProfile(res.data)).catch(() => {});
    api.get("/projects")
      .then((res) => setProjects(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setProjectsLoading(false));
    api.get("/experience").then((res) => setExperience(res.data)).catch(() => {});
    api.get("/education").then((res) => setEducation(res.data)).catch(() => {});
    api.get("/certifications").then((res) => setCertifications(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero / Sobre mí — única animación con intención del sitio: las filas
          del registro aparecen en secuencia, como un resultado de consulta. */}
      <Container as="section" id="perfil" className="pt-16 pb-14">
        <motion.div initial="hidden" animate="show" variants={recordStagger} className="max-w-2xl">
          <motion.h1 variants={recordRow} className="mb-1 text-[clamp(30px,4.5vw,44px)] leading-tight">
            {profile?.full_name || "Tu nombre aquí"}
          </motion.h1>
          {profile?.headline && (
            <motion.p variants={recordRow} className="mb-6 text-lg text-primary">
              {profile.headline}
            </motion.p>
          )}

          {(profile?.location || profile?.skills?.length > 0) && (
            <motion.dl variants={recordRow} className="mb-6 grid grid-cols-[100px_1fr] gap-x-4 gap-y-1.5 font-mono text-[13px]">
              {profile?.location && (
                <>
                  <dt className="text-muted-foreground">location</dt>
                  <dd>{profile.location}</dd>
                </>
              )}
              {profile?.skills?.length > 0 && (
                <>
                  <dt className="text-muted-foreground">stack</dt>
                  <dd>{profile.skills.join(" · ")}</dd>
                </>
              )}
            </motion.dl>
          )}

          {profile?.bio && (
            <motion.p variants={recordRow} className="mb-6 border-t border-border pt-5 text-base leading-relaxed text-muted-foreground">
              {profile.bio}
            </motion.p>
          )}

          {profile?.cv_url && (
            <motion.div variants={recordRow}>
              <Button asChild><a href={profile.cv_url} target="_blank" rel="noreferrer">Descargar CV</a></Button>
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* Proyectos destacados */}
      <Container as="section" id="proyectos" className="py-6 pb-14">
        <SectionHeading
          title="Proyectos"
          action={<Link to="/proyectos" className="font-mono text-[13px] text-muted-foreground hover:text-primary">ver todos</Link>}
        />
        {projectsLoading && <LoadingState rows={3} />}
        {!projectsLoading && projects.length === 0 && (
          <p className="text-sm text-muted-foreground">Aún no hay proyectos publicados.</p>
        )}
        {projects.length > 0 && (
          <div className="hidden border-b border-border pb-1.5 font-mono text-xs text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] sm:gap-4">
            <span>proyecto</span>
            <span>stack</span>
            <span className="text-right">actualizado</span>
          </div>
        )}
        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </Container>

      {/* Experiencia */}
      {experience.length > 0 && (
        <Container as="section" id="experiencia" className="py-6 pb-14">
          <SectionHeading title="Experiencia" />
          {experience.map((item) => (
            <div key={item.id} className="grid grid-cols-1 gap-1 border-b border-border py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
              <div className="font-mono text-xs text-muted-foreground">
                {formatRange(item.start_date, item.end_date)}
              </div>
              <div>
                <h3 className="mb-0.5 text-base font-medium">{item.role}</h3>
                <div className="mb-1.5 text-sm text-primary">{item.company}{item.location ? ` · ${item.location}` : ""}</div>
                {item.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>}
              </div>
            </div>
          ))}
        </Container>
      )}

      {/* Educación */}
      {education.length > 0 && (
        <Container as="section" id="educacion" className="py-6 pb-14">
          <SectionHeading title="Educación" />
          {education.map((item) => (
            <div key={item.id} className="grid grid-cols-1 gap-1 border-b border-border py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
              <div className="font-mono text-xs text-muted-foreground">
                {formatRange(item.start_date, item.end_date)}
              </div>
              <div>
                <h3 className="mb-0.5 text-base font-medium">{item.degree}{item.field ? ` · ${item.field}` : ""}</h3>
                <div className="text-sm text-primary">{item.institution}</div>
                {item.description && <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>}
              </div>
            </div>
          ))}
        </Container>
      )}

      {/* Certificaciones */}
      {certifications.length > 0 && (
        <Container as="section" id="certificaciones" className="py-6 pb-14">
          <SectionHeading title="Certificaciones" />
          {certifications.map((c) => (
            <a
              key={c.id}
              href={c.credential_url || undefined}
              target={c.credential_url ? "_blank" : undefined}
              rel="noreferrer"
              className="grid grid-cols-1 gap-1 border-b border-border py-3.5 transition-colors hover:bg-accent sm:grid-cols-[1fr_1fr_auto] sm:items-baseline sm:gap-4"
            >
              <span className="text-sm">{c.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{c.issuer}</span>
              <span className="font-mono text-xs text-muted-foreground sm:text-right">
                {c.issue_date && new Date(c.issue_date).toLocaleDateString("es-ES", { year: "numeric", month: "short" })}
              </span>
            </a>
          ))}
        </Container>
      )}

      {/* Contacto */}
      <Container as="section" id="contacto" className="py-6 pb-20">
        <SectionHeading title="Contacto" />
        <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:gap-10">
          <div>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              ¿Tenés un proyecto en mente o alguna consulta? Escribime y te respondo a la brevedad.
            </p>
            <dl className="grid grid-cols-[90px_1fr] gap-x-4 gap-y-2 font-mono text-[13px]">
              {profile?.email && (
                <>
                  <dt className="text-muted-foreground">email</dt>
                  <dd><a href={`mailto:${profile.email}`} className="hover:text-primary">{profile.email}</a></dd>
                </>
              )}
              {profile?.github_url && (
                <>
                  <dt className="text-muted-foreground">github</dt>
                  <dd><a href={profile.github_url} target="_blank" rel="noreferrer" className="hover:text-primary">{profile.github_url.replace(/^https?:\/\//, "")}</a></dd>
                </>
              )}
              {profile?.linkedin_url && (
                <>
                  <dt className="text-muted-foreground">linkedin</dt>
                  <dd><a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-primary">{profile.linkedin_url.replace(/^https?:\/\//, "")}</a></dd>
                </>
              )}
              {profile?.location && (
                <>
                  <dt className="text-muted-foreground">ubicación</dt>
                  <dd>{profile.location}</dd>
                </>
              )}
            </dl>
          </div>
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
