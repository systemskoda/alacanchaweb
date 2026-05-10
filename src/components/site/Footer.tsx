import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-primary py-8 text-center text-sm text-primary-foreground/80">
      <div className="flex flex-col items-center gap-3">
        <img src={logo} alt="A la Cancha" className="h-14 w-14 object-contain" />
        <p className="font-display tracking-wide">
          A LA <span className="text-gold">CANCHA</span> © 2026 — Radio Altos Bahía Blanca 97.9
        </p>
      </div>
    </footer>
  );
}
