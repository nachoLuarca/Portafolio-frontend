import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectForm from "./pages/ProjectForm.jsx";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import ExperienceList from "./pages/ExperienceList.jsx";
import ExperienceForm from "./pages/ExperienceForm.jsx";
import EducationList from "./pages/EducationList.jsx";
import EducationForm from "./pages/EducationForm.jsx";
import CertificationsList from "./pages/CertificationsList.jsx";
import CertificationsForm from "./pages/CertificationsForm.jsx";
import MessagesAdmin from "./pages/MessagesAdmin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proyectos" element={<Projects />} />
        <Route path="/proyectos/:slug" element={<ProjectDetail />} />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/proyectos/:id" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
        <Route path="/admin/experiencia" element={<PrivateRoute><ExperienceList /></PrivateRoute>} />
        <Route path="/admin/experiencia/:id" element={<PrivateRoute><ExperienceForm /></PrivateRoute>} />
        <Route path="/admin/educacion" element={<PrivateRoute><EducationList /></PrivateRoute>} />
        <Route path="/admin/educacion/:id" element={<PrivateRoute><EducationForm /></PrivateRoute>} />
        <Route path="/admin/certificaciones" element={<PrivateRoute><CertificationsList /></PrivateRoute>} />
        <Route path="/admin/certificaciones/:id" element={<PrivateRoute><CertificationsForm /></PrivateRoute>} />
        <Route path="/admin/mensajes" element={<PrivateRoute><MessagesAdmin /></PrivateRoute>} />
        <Route path="/admin/perfil" element={<PrivateRoute><ProfileEdit /></PrivateRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
