import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard.jsx";
import ContactForm from "../components/ContactForm.jsx";
import Container from "../components/Container.jsx";
import LoadingState from "../components/LoadingState.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import WaveDivider from "../components/WaveDivider.jsx";
import { Button } from "@/components/ui/button";
import { recordStagger, recordRow, staggerContainer, fadeUp, viewportOnce } from "@/lib/motion";

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

  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 50, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 50, damping: 20 });
  const blob2X = useTransform(springX, (v) => -v * 0.6);
  const blob2Y = useTransform(springY, (v) => -v * 0.6);

  function handleHeroMouseMove(e) {
    if (reduceMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 40);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 40);
  }

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
      {/* Hero — navy fijo, ilustración propia (blobs + stack flotante) en vez
          de un ícono decorativo copiado de un tercero. Única animación con
          intención del sitio: las filas del hero entran en secuencia. */}
      <section
        id="perfil"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative overflow-hidden bg-(--hero-bg) pt-20 pb-28"
      >
        <motion.div
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-(--hero-accent)/30 blur-3xl"
          style={reduceMotion ? undefined : { x: springX, y: springY }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-32 left-10 size-72 rounded-full bg-fuchsia-500/20 blur-3xl"
          style={reduceMotion ? undefined : { x: blob2X, y: blob2Y }}
        />

        <Container className="relative grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <motion.div initial="hidden" animate="show" variants={recordStagger}>
            <motion.h1 variants={recordRow} className="mb-3 text-[clamp(34px,5vw,52px)] leading-[1.05] text-(--hero-fg)">
              {profile?.full_name || "Tu nombre aquí"}
            </motion.h1>
            {profile?.headline && (
              <motion.p variants={recordRow} className="mb-6 text-lg font-medium text-(--hero-accent)">
                {profile.headline}
              </motion.p>
            )}
            {profile?.bio && (
              <motion.p variants={recordRow} className="mb-8 max-w-xl text-base leading-relaxed text-(--hero-muted)">
                {profile.bio}
              </motion.p>
            )}
            <motion.div variants={recordRow} className="flex flex-wrap items-center gap-4">
              {profile?.cv_url && (
                <Button asChild size="lg"><a href={profile.cv_url} target="_blank" rel="noreferrer">Descargar CV</a></Button>
              )}
              {profile?.location && <span className="text-sm text-(--hero-muted)">📍 {profile.location}</span>}
            </motion.div>
          </motion.div>

          {profile?.skills?.length > 0 && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={recordStagger}
              className="relative flex flex-wrap items-center justify-center gap-3 py-6"
            >
              {profile.skills.map((s, i) => (
                <motion.span
                  key={s}
                  variants={recordRow}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-(--hero-fg) backdrop-blur-sm"
                  style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + i)}deg)` }}
                >
                  {s}
                </motion.span>
              ))}
            </motion.div>
          )}
        </Container>

        <div className="absolute right-0 bottom-0 left-0">
          <WaveDivider fill="fill-background" />
        </div>
      </section>

      {/* Proyectos */}
      <Container as="section" id="proyectos" className="py-20">
        <SectionHeading
          title="Proyectos"
          subtitle="Una selección de trabajos con foco en integraciones, APIs y consistencia de datos."
          action={<Link to="/proyectos" className="text-sm font-medium text-primary hover:underline">Ver todos</Link>}
        />
        {projectsLoading && <LoadingState rows={3} />}
        {!projectsLoading && projects.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">Aún no hay proyectos publicados.</p>
        )}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      </Container>

      {/* Experiencia */}
      {experience.length > 0 && (
        <Container as="section" id="experiencia" className="py-16">
          <SectionHeading title="Experiencia" />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="border-l-2 border-primary/20 pl-6"
          >
            {experience.map((item) => (
              <motion.div key={item.id} variants={fadeUp} className="relative mb-8 last:mb-0">
                <span className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-primary" />
                <div className="mb-1 text-sm font-medium text-muted-foreground">
                  {formatRange(item.start_date, item.end_date)}
                </div>
                <h3 className="mb-0.5 font-heading text-lg font-semibold">{item.role}</h3>
                <div className="mb-2 text-sm font-medium text-primary">{item.company}{item.location ? ` · ${item.location}` : ""}</div>
                {item.description && <p className="text-sm whitespace-pre-wrap">{item.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        </Container>
      )}

      {/* Educación */}
      {education.length > 0 && (
        <Container as="section" id="educacion" className="py-16">
          <SectionHeading title="Educación" />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2"
          >
            {education.map((item) => (
              <motion.div key={item.id} variants={fadeUp} className="rounded-2xl bg-muted p-5">
                <div className="mb-1 text-sm font-medium text-muted-foreground">
                  {formatRange(item.start_date, item.end_date)}
                </div>
                <h3 className="font-heading text-base font-semibold">{item.degree}</h3>
                {item.field && <div className="mb-0.5 text-sm text-muted-foreground">{item.field}</div>}
                <div className="text-sm font-medium text-primary">{item.institution}</div>
                {item.description && <p className="mt-2 text-sm">{item.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        </Container>
      )}

      {/* Certificaciones */}
      {certifications.length > 0 && (
        <Container as="section" id="certificaciones" className="py-16">
          <SectionHeading title="Certificaciones" />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4"
          >
            {certifications.map((c) => (
              <motion.a
                key={c.id}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                href={c.credential_url || undefined}
                target={c.credential_url ? "_blank" : undefined}
                rel="noreferrer"
                className="block rounded-2xl border border-border bg-card p-4.5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-1 text-sm font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.issuer}</div>
                {c.issue_date && (
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    {new Date(c.issue_date).toLocaleDateString("es-ES", { year: "numeric", month: "short" })}
                  </div>
                )}
              </motion.a>
            ))}
          </motion.div>
        </Container>
      )}

      {/* Contacto */}
      <Container as="section" id="contacto" className="py-16 pb-24">
        <SectionHeading title="Contacto" subtitle="¿Tenés un proyecto en mente? Escribime y te respondo a la brevedad." />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto max-w-xl"
        >
          <ContactForm />
        </motion.div>
      </Container>
    </div>
  );
}
