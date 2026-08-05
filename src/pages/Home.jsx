import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard.jsx";
import ContactForm from "../components/ContactForm.jsx";
import Container from "../components/Container.jsx";
import LoadingState from "../components/LoadingState.jsx";
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

  return (
    <div>
      {/* Hero / Sobre mí */}
      <Container as="section" id="perfil" className="pt-22 pb-14">
        <div className="text-center">
          <motion.h1 initial="hidden" animate="show" variants={fadeUp} className="mx-auto mb-4.5 w-full text-[clamp(32px,5vw,52px)]">
            {profile?.full_name || "Tu nombre aquí"}
          </motion.h1>

          <motion.p initial="hidden" animate="show" variants={fadeUp} className="mx-auto mb-5 min-h-6 w-full font-mono text-base text-primary sm:max-w-[85%]">
            <TypedHeadline headline={profile?.headline} />
          </motion.p>

          {profile?.skills?.length > 0 && (
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto mb-7 w-full">
              <div className="mb-2.5 font-mono text-xs text-muted-foreground">stack</div>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.skills.map((s) => (
                  <Badge key={s} variant="outline" className="font-mono font-normal text-muted-foreground">{s}</Badge>
                ))}
              </div>
            </motion.div>
          )}

          <motion.p initial="hidden" animate="show" variants={fadeUp} className="mx-auto mb-3 w-full text-base wrap-break-word whitespace-normal text-muted-foreground sm:max-w-[70%]">
            {profile?.bio}
          </motion.p>
          {profile?.location && (
            <motion.p initial="hidden" animate="show" variants={fadeUp} className="mx-auto mb-7 w-full font-mono text-[13px] sm:max-w-[55%]">📍 {profile.location}</motion.p>
          )}

          {profile?.cv_url && (
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex justify-center">
              <Button asChild><a href={profile.cv_url} target="_blank" rel="noreferrer">Descargar CV</a></Button>
            </motion.div>
          )}
        </div>
      </Container>

      {/* Proyectos destacados */}
      <Container as="section" id="proyectos" className="py-6 pb-16">
        <div className="mb-7 flex items-end justify-between">
          <h2 className="text-[28px]">Proyectos</h2>
          <Link to="/proyectos" className="font-mono text-[13px] text-muted-foreground hover:text-accent-2">ver todos →</Link>
        </div>
        {projectsLoading && <LoadingState rows={3} />}
        {!projectsLoading && projects.length === 0 && (
          <p className="text-sm">Aún no hay proyectos publicados.</p>
        )}
        {projects.map((p) => (
          <motion.div key={p.id} initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
            <ProjectCard project={p} />
          </motion.div>
        ))}
      </Container>

      {/* Experiencia */}
      {experience.length > 0 && (
        <Container as="section" id="experiencia" className="py-10 pb-16">
          <motion.h2 initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="mb-7 text-[28px]">Experiencia</motion.h2>
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
          <motion.h2 initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="mb-7 text-[28px]">Educación</motion.h2>
          <div className="grid gap-3.5">
            {education.map((item) => (
              <motion.div key={item.id} initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="rounded-lg border border-border bg-card p-5">
                <div className="mb-1 font-mono text-xs text-muted-foreground">
                  {formatRange(item.start_date, item.end_date)}
                </div>
                <h3 className="mb-0.5 text-[17px]">{item.degree}{item.field ? ` · ${item.field}` : ""}</h3>
                <div className="text-sm text-primary">{item.institution}</div>
                {item.description && <p className="mt-2 text-sm">{item.description}</p>}
              </motion.div>
            ))}
          </div>
        </Container>
      )}

      {/* Certificaciones */}
      {certifications.length > 0 && (
        <Container as="section" id="certificaciones" className="py-6 pb-16">
          <motion.h2 initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="mb-7 text-[28px]">Certificaciones</motion.h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
            {certifications.map((c) => (
              <motion.a
                key={c.id}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                href={c.credential_url || undefined}
                target={c.credential_url ? "_blank" : undefined}
                rel="noreferrer"
                className="block rounded-lg border border-border bg-card p-4.5 transition-shadow hover:border-primary hover:shadow-lg"
              >
                <div className="mb-1 text-[15px]">{c.name}</div>
                <div className="font-mono text-xs text-muted-foreground">{c.issuer}</div>
                {c.issue_date && (
                  <div className="mt-1.5 font-mono text-[11px] text-muted-foreground">
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
        <motion.h2 initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="mb-7 text-[28px]">Contacto</motion.h2>
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
          <ContactForm />
        </motion.div>
      </Container>
    </div>
  );
}
