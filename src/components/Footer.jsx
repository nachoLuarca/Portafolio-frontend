import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import api from "../api/axios";
import Container from "./Container.jsx";
import WaveDivider from "./WaveDivider.jsx";

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.46-1.19-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.04 1.53 1.04.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V20.5h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.5 20.5h-3.38v-6.3c0-1.5-.03-3.43-2.09-3.43-2.1 0-2.42 1.64-2.42 3.32v6.41H9.23V8.5h3.24v1.64h.05c.45-.86 1.56-1.77 3.21-1.77 3.44 0 4.77 2.34 4.77 5.4V20.5Z" />
    </svg>
  );
}

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile").then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  const links = [
    profile?.github_url && { href: profile.github_url, label: "GitHub", Icon: GithubIcon, external: true },
    profile?.linkedin_url && { href: profile.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon, external: true },
    profile?.email && { href: `mailto:${profile.email}`, label: "Email", Icon: Mail, external: false },
  ].filter(Boolean);

  if (links.length === 0) return null;

  return (
    <footer className="bg-(--hero-bg) pt-1 pb-10">
      <WaveDivider fill="fill-(--hero-bg)" flip />
      <Container className="flex flex-col items-center gap-4">
        <div className="flex justify-center gap-6">
          {links.map(({ href, label, Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              aria-label={label}
              title={label}
              className="text-(--hero-muted) transition-colors hover:text-(--hero-accent)"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
        <p className="text-xs text-(--hero-muted)">© {new Date().getFullYear()} {profile?.full_name}</p>
      </Container>
    </footer>
  );
}
