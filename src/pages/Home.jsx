import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard.jsx";
import ContactForm from "../components/ContactForm.jsx";
import Container from "../components/Container.jsx";
import LoadingState from "../components/LoadingState.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeUp, viewportOnce } from "@/lib/motion";

function formatRange(start, end) {
  const opts = { year: "numeric", month: "short" };
  const s = start ? new Date(start).toLocaleDateString("es-ES", opts) : "";
  const e = end ? new Date(end).toLocaleDateString("es-ES", opts) : "actualidad";
  return `${s} — ${e}`;
}

// Aislado en su propio componente: el intervalo de tipeo dispara un
// setState cada ~28ms. Si esa state viviera en Home, cada tick
// re-renderiza TODA la página (hero + proyectos + experiencia + ...),
// lo que satura el hilo principal y deja sin margen a las animaciones
// de Framer Motion del resto de la página (quedan "trabadas" en opacidad
// casi cero mientras dura el tipeo). Acá el tick solo re-renderiza esto.
function TypedHeadline({ headline }) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    if (!headline) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(headline.slice(0, i));
      if (i >= headline.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [headline]);

  return <>{typed}<span className="opacity-60">▌</span></>;
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

  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const restProjects = projects.filter((p) => p !== featuredProject);

  return (
    <div>
      {/* Hero / Sobre mí */}
      <Container as="section" id="perfil" className="pt-22 pb-16">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-start md:gap-10">
          <div>
            <motion.h1 initial="hidden" animate="show" variants={fadeUp} className="mb-3 text-left text-[clamp(34px,5.5vw,56px)] leading-[1.05]">
              {profile?.full_name || "Tu nombre aquí"}
            </motion.h1>

            <motion.p initial="hidden" animate="show" variants={fadeUp} className="mb-5 min-h-6 text-left font-mono text-base text-primary">
              <TypedHeadline headline={profile?.headline} />
            </motion.p>

            {profile?.location && (
              <motion.p initial="hidden" animate="show" variants={fadeUp} className="mb-6 font-mono text-[13px] text-muted-foreground">
                📍 {profile.location}
              </motion.p>
            )}

            {profile?.cv_url && (
              <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex">
                <Button asChild><a href={profile.cv_url} target="_blank" rel="noreferrer">Descargar CV</a></Button>
              </motion.div>
            )}
          </div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-warning/60" />
              <span className="size-2.5 rounded-full bg-success/60" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">whoami.sh</span>
            </div>
            <div className="p-5">
              {profile?.bio && (
                <p className="mb-5 text-left text-sm leading-relaxed text-muted-foreground wrap-break-word whitespace-normal">
                  {profile.bio}
                </p>
              )}
              {profile?.skills?.length > 0 && (
                <div>
                  <div className="mb-2.5 font-mono text-xs text-accent-2">$ stack --list</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s) => (
                      <Badge key={s} variant="outline" className="font-mono font-normal text-muted-foreground">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Proyectos destacados */}
      <Container as="section" id="proyectos" className="py-6 pb-16">
        <SectionHeading
          index="01"
          title="Proyectos"
          action={<Link to="/proyectos" className="font-mono text-[13px] text-muted-foreground hover:text-accent-2">ver todos →</Link>}
        />
        {projectsLoading && <LoadingState rows={3} />}
        {!projectsLoading && projects.length === 0 && (
          <p className="text-sm">Aún no hay proyectos publicados.</p>
        )}
        {featuredProject && (
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="md:col-span-2">
              <ProjectCard project={featuredProject} large />
            </motion.div>
            {restProjects.map((p) => (
              <motion.div key={p.id} initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </div>
        )}
      </Container>

      {/* Experiencia */}
      {experience.length > 0 && (
        <Container as="section" id="experiencia" className="py-10 pb-16">
          <SectionHeading index="02" title="Experiencia" />
          <div className="border-l border-border pl-6">
            {experience.map((item) => (
              <motion.div key={item.id} initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="relative mb-7">
                <span className="absolute -left-7.25 top-1 h-2 w-2 rounded-full bg-primary" />
                <div className="mb-1 font-mono text-xs text-muted-foreground">
                  {formatRange(item.start_date, item.end_date)}
                </div>
                <h3 className="mb-0.5 text-lg">{item.role}</h3>
                <div className="mb-2 text-sm text-primary">{item.company}{item.location ? ` · ${item.location}` : ""}</div>
                {item.description && <p className="text-sm whitespace-pre-wrap">{item.description}</p>}
              </motion.div>
            ))}
          </div>
        </Container>
      )}

      {/* Educación */}
      {education.length > 0 && (
        <Container as="section" id="educacion" className="py-6 pb-16">
          <SectionHeading index="03" title="Educación" />
          <div className="divide-y divide-border border-t border-border">
            {education.map((item) => (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={fadeUp}
                className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6"
              >
                <div className="font-mono text-xs text-muted-foreground">
                  {formatRange(item.start_date, item.end_date)}
                </div>
                <div>
                  <h3 className="mb-0.5 text-[17px]">{item.degree}{item.field ? ` · ${item.field}` : ""}</h3>
                  <div className="text-sm text-primary">{item.institution}</div>
                  {item.description && <p className="mt-2 text-sm">{item.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      )}

      {/* Certificaciones */}
      {certifications.length > 0 && (
        <Container as="section" id="certificaciones" className="py-6 pb-16">
          <SectionHeading index="04" title="Certificaciones" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
            {certifications.map((c) => (
              <motion.a
                key={c.id}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={fadeUp}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                href={c.credential_url || undefined}
                target={c.credential_url ? "_blank" : undefined}
                rel="noreferrer"
                className="block rounded-md border border-border bg-transparent p-3.5 transition-colors hover:border-primary hover:bg-card"
              >
                <div className="mb-1 text-sm">{c.name}</div>
                <div className="font-mono text-[11px] text-muted-foreground">{c.issuer}</div>
                {c.issue_date && (
                  <div className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                    {new Date(c.issue_date).toLocaleDateString("es-ES", { year: "numeric", month: "short" })}
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        </Container>
      )}

      {/* Contacto */}
      <Container as="section" id="contacto" className="py-6 pb-24">
        <SectionHeading index="05" title="Contacto" />
        <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:gap-10">
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              ¿Tenés un proyecto en mente o alguna consulta? Escribime y te respondo a la brevedad.
            </p>
            <dl className="space-y-3 font-mono text-[13px]">
              {profile?.email && (
                <div className="flex gap-2">
                  <dt className="text-accent-2">email</dt>
                  <dd><a href={`mailto:${profile.email}`} className="hover:text-accent-2">{profile.email}</a></dd>
                </div>
              )}
              {profile?.github_url && (
                <div className="flex gap-2">
                  <dt className="text-accent-2">github</dt>
                  <dd><a href={profile.github_url} target="_blank" rel="noreferrer" className="hover:text-accent-2">{profile.github_url.replace(/^https?:\/\//, "")}</a></dd>
                </div>
              )}
              {profile?.linkedin_url && (
                <div className="flex gap-2">
                  <dt className="text-accent-2">linkedin</dt>
                  <dd><a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-accent-2">{profile.linkedin_url.replace(/^https?:\/\//, "")}</a></dd>
                </div>
              )}
              {profile?.location && (
                <div className="flex gap-2">
                  <dt className="text-accent-2">ubicación</dt>
                  <dd>{profile.location}</dd>
                </div>
              )}
            </dl>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
            <ContactForm />
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
