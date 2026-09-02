import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ConnectionBanner from "./components/ConnectionBanner.jsx";
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
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const reduceMotion = useReducedMotion();

  return (
    <>
      <ConnectionBanner />
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Routes location={location}>
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
        </motion.div>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </>
  );
}
