import { useEffect, useState } from "react";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard.jsx";
import Container from "../components/Container.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-14 pb-22">
      <h1 className="mb-8 text-[34px]">Proyectos</h1>

      {loading && <p>Cargando…</p>}
      {!loading && projects.length === 0 && <p>Todavía no hay proyectos publicados.</p>}
      {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
    </Container>
  );
}
