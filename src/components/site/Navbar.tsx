import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Inicio", hash: "" },
  { to: "/", label: "Notas", hash: "notas" },
  { to: "/", label: "Audio", hash: "audio" },
  { to: "/", label: "Sponsors", hash: "sponsors" },
  { to: "/", label: "Contacto", hash: "contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  const scroll = (id: string) => {
    setOpen(false);
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-display text-2xl font-bold tracking-wide" onClick={() => scroll("")}>
          <img src={logo} alt="A la Cancha" className="h-10 w-10 object-contain" />
          A LA <span className="text-gold">CANCHA</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => scroll(l.hash)}
              className="rounded-md px-4 py-2 font-display text-sm uppercase tracking-wider transition hover:bg-white/10 hover:text-gold"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-primary px-4 py-2 md:hidden">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => scroll(l.hash)}
              className="block w-full rounded-md px-3 py-3 text-left font-display uppercase tracking-wider hover:bg-white/10"
            >
              {l.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
