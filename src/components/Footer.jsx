import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import api from "../api/axios";
import Container from "./Container.jsx";
import WaveDivider from "./WaveDivider.jsx";
import { GithubIcon, LinkedinIcon } from "./icons.jsx";

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
