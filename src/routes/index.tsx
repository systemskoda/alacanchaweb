import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radio, Calendar, Mic, Trophy, Instagram, Facebook, MapPin, Clock, Globe, ArrowRight, Twitch, Youtube, Tv, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryItem = {
  id: string;
  image_url: string;
  name?: string;
};

type PaginatedGalleryProps = {
  items: GalleryItem[];
  emptyText: string;
};

const ITEMS_PER_PAGE = 8;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-stadium.jpg";
import logo from "@/assets/logo.png";
import teamFabian from "@/assets/team-fabian.jpg";
import teamPie from "@/assets/team-pie.jpg";
import teamRossi from "@/assets/team-rossi.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

type Audio = { id: string; title: string; description: string; audio_url: string; published_at: string | null; is_featured?: boolean };
type Sponsor = { id: string; name: string; image_url: string };
type Match = { id: string; title: string; description: string; cover_image_url: string | null; stream_url: string | null; match_date: string | null };
type Guest = { id: string; name: string; image_url: string };
type Image = { id: string; filename: string; url: string };

const TWITCH_URL = "https://www.twitch.tv/radioaltos979";
const YOUTUBE_URL = "https://www.youtube.com/@ALACANCHARADIO";
const INSTAGRAM_URL = "https://www.instagram.com/alacanchabb/";

const team = [
  { name: "Fabián Rodríguez", role: "Conductor", image: teamFabian },
  { name: "Mariano Rossi", role: "Coconductor", image: teamRossi },
  { name: "Gustavo Pie", role: "Coconductor", image: teamPie },
];

const RADIO_WEB = "https://www.fmaltos.com.ar";

function Home() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [latestAudio, setLatestAudio] = useState<Audio | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [matchOfDay, setMatchOfDay] = useState<Match | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    supabase.from("audios").select("*").order("published_at", { ascending: false }).limit(3).then(({ data }) => {
      setAudios(data ?? []);
    });
    supabase.from("audios").select("*").eq("is_featured", true).limit(1).then(({ data }) => {
      if (data && data.length > 0) {
        setLatestAudio(data[0]);
      } else {
        supabase.from("audios").select("*").order("published_at", { ascending: false }).limit(1).then(({ data: latest }) => {
          setLatestAudio(latest?.[0] ?? null);
        });
      }
    });
    supabase.from("sponsors").select("*").eq("active", true).order("created_at", { ascending: false }).then(({ data }) => setSponsors(data ?? []));
    supabase.from("matches").select("*").eq("is_match_of_day", true).order("created_at", { ascending: false }).limit(1).then(({ data }) => setMatchOfDay(data?.[0] ?? null));
    supabase.from("guests").select("*").order("created_at", { ascending: false }).then(({ data }) => setGuests(data ?? []));
    supabase.from("images").select("*").order("created_at", { ascending: false }).then(({ data }) => setImages(data ?? []));
  }, []);

  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-pitch relative overflow-hidden px-4 py-16 text-primary-foreground sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-stretch gap-8 lg:grid-cols-2">
          {/* Columna 1: Título + Última Nota */}
          <div className="flex flex-col gap-6">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/20 px-4 py-1.5 text-xs uppercase tracking-widest text-gold backdrop-blur">
                <Radio className="h-3.5 w-3.5" /> En vivo · 97.9 FM
              </div>
              <h1 className="flex items-center justify-center lg:justify-start gap-4 font-display text-5xl font-bold leading-none tracking-tight text-balance sm:text-6xl">
                <span>A LA <span className="text-gold">CANCHA</span></span>
                <img src={logo} alt="A la Cancha" className="h-20 w-20 sm:h-24 sm:w-24 object-contain drop-shadow-2xl" />
              </h1>
              <p className="mt-6 max-w-xl text-base text-white/85 sm:text-lg lg:mx-0 mx-auto">
                Programa integral de deportes donde la información y los protagonistas cobran voz.
              </p>
              <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-4 py-2.5 text-sm backdrop-blur">
                <Radio className="h-4 w-4 text-gold" />
                <span className="font-semibold">Radio Altos 97.9</span>
                <span className="opacity-60">·</span>
                <span>Lun a Vie 19 a 21hs</span>
              </div>
              <a href={RADIO_WEB} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center lg:justify-start gap-2 text-sm text-gold hover:underline">
                <Globe className="h-4 w-4" /> www.fmaltos.com.ar
              </a>
              <div className="mt-5 flex justify-center lg:justify-start gap-2">
                <a href={TWITCH_URL} target="_blank" rel="noreferrer" aria-label="Twitch" className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 transition hover:bg-gold hover:text-gold-foreground">
                  <Twitch className="h-5 w-5" />
                </a>
                <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" aria-label="YouTube" className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 transition hover:bg-gold hover:text-gold-foreground">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 transition hover:bg-gold hover:text-gold-foreground">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Última Nota */}
            <div className="rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur shadow-2xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
                <Mic className="h-3.5 w-3.5" /> Última Nota
              </div>
              {latestAudio ? (
                <>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight">{latestAudio.title}</h3>
                  {latestAudio.description && (
                    <p className="mt-2 text-sm text-white/75 line-clamp-3">{latestAudio.description}</p>
                  )}
                  <time className="mt-3 block text-xs uppercase tracking-widest text-white/60">
                    {latestAudio.published_at ? new Date(latestAudio.published_at).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" }) : ""}
                  </time>
                  <audio controls className="mt-4 w-full" src={latestAudio.audio_url} />
                </>
              ) : (
                <>
                  <h3 className="mt-3 font-display text-2xl font-bold">Próximamente</h3>
                  <p className="mt-2 text-sm text-white/75">La última nota publicada aparecerá aquí.</p>
                  <div className="mt-4 h-12 rounded-md bg-white/10" />
                </>
              )}
            </div>
          </div>

          {/* Columna 2: Partido de la fecha */}
          <div className="rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur shadow-2xl flex flex-col">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
              <Tv className="h-3.5 w-3.5" /> El Partido de la Fecha
            </div>
            {matchOfDay ? (
              <>
                {matchOfDay.cover_image_url ? (
                  <div className="mt-3 overflow-hidden rounded-xl bg-white/5">
                    <img
                      src={matchOfDay.cover_image_url}
                      alt={matchOfDay.title}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="mt-3 aspect-video rounded-xl bg-white/10 grid place-items-center">
                    <Trophy className="h-12 w-12 text-white/30" />
                  </div>
                )}
                <h3 className="mt-3 font-display text-xl font-bold leading-tight">{matchOfDay.title}</h3>
                {matchOfDay.match_date && (
                  <time className="mt-1 block text-xs uppercase tracking-widest text-white/60">
                    {new Date(matchOfDay.match_date).toLocaleString("es-AR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}
                  </time>
                )}
                {matchOfDay.stream_url && (
                  <a href={matchOfDay.stream_url} target="_blank" rel="noreferrer" className="mt-3">
                    <Button size="sm" className="w-full bg-gold text-gold-foreground hover:bg-gold/90 font-display uppercase tracking-wider">
                      Ver transmisión
                    </Button>
                  </a>
                )}
              </>
            ) : (
              <>
                <div className="mt-3 aspect-video rounded-xl bg-white/10 grid place-items-center">
                  <Trophy className="h-12 w-12 text-white/30" />
                </div>
                <p className="mt-3 text-sm text-white/75 text-center">Próximamente.</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Acompañan" title="Sponsors" />
          {(() => {
            const base = sponsors.length ? sponsors : Array.from({ length: 6 }).map((_, i) => ({ id: `ph-${i}`, name: "", image_url: "" }) as Sponsor);
            // Ensure one "set" has enough items to fill the viewport so the loop has no gap
            const minPerSet = 8;
            const repeats = Math.max(1, Math.ceil(minPerSet / base.length));
            const set = Array.from({ length: repeats }).flatMap(() => base);
            const loop = [...set, ...set];
            return (
              <div className="mt-10 overflow-hidden select-none pointer-events-none" aria-hidden={false}>
                <div className="flex gap-6 animate-marquee w-max">
                  {loop.map((s, idx) => (
                    <div key={`${s.id}-${idx}`} className="flex h-40 w-64 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-card p-6 shadow-sm">
                      {s.image_url ? (
                        <img src={s.image_url} alt={s.name} className="max-h-full max-w-full object-contain" draggable={false} />
                      ) : (
                        <Trophy className="h-10 w-10 text-muted-foreground/30" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* About */}
      <section id="programa" className="bg-secondary px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="Sobre el ciclo" title="El Programa" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-muted-foreground">
            Con más de 5.000 emisiones y 19 años al aire en los medios bahienses, A la Cancha busca ofrecer un ciclo ameno y compartir nuestra pasión con los amantes de todas las disciplinas deportivas. Moderno, ágil y comprometido socialmente.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Mic, value: "5.000+", label: "Emisiones" },
              { icon: Calendar, value: "19", label: "Años al aire" },
              { icon: Radio, value: "97.9", label: "FM" },
            ].map((s) => (
              <div key={s.label} className="group rounded-xl border-2 border-border bg-card p-8 text-center transition hover:border-primary-bright hover:shadow-xl">
                <s.icon className="mx-auto mb-3 h-8 w-8 text-primary-bright" />
                <div className="font-display text-5xl font-bold text-primary">{s.value}</div>
                <div className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Quiénes somos" title="El Equipo" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div key={m.name} className="overflow-hidden rounded-xl bg-card shadow-md transition hover:-translate-y-1 hover:shadow-xl border border-border">
                {m.image ? (
                  <div className="aspect-square w-full overflow-hidden bg-pitch">
                    <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="bg-pitch flex aspect-square items-center justify-center text-primary-foreground/40">
                    <Trophy className="h-20 w-20" />
                  </div>
                )}
                <div className="p-6 text-center">
                  <h3 className="font-display text-xl font-semibold text-primary">{m.name}</h3>
                  <p className="mt-1 text-sm uppercase tracking-widest text-primary-bright">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temporada 2026 */}
      <section id="temporada-2026" className="bg-secondary px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Nueva temporada" title="Temporada 2026" />

          <PaginatedGallery
            items={images.map((img) => ({
              id: img.id,
              image_url: img.url,
              name: "",
            }))}
            emptyText="Próximamente: imágenes de la temporada 2026."
          />
        </div>
      </section>

      {/* Fotos Históricas */}
      <section id="fotos-historicas" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Revivilas" title="Fotos Históricas" />

          <PaginatedGallery
            items={guests}
            emptyText="Próximamente: fotos históricas del programa."
          />
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="bg-pitch px-4 py-20 text-primary-foreground sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">Contacto</h2>
          <div className="mx-auto mt-8 grid max-w-xl gap-4 text-left">
            <ContactRow icon={Radio} label="Radio Altos Bahía Blanca 97.9" />
            <ContactRow icon={Clock} label="Lunes a Viernes · 19 a 21hs" />
            <ContactRow icon={MapPin} label="Bahía Blanca, Buenos Aires" />
            <a href={RADIO_WEB} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-white/15 bg-black/20 px-4 py-3 backdrop-blur transition hover:bg-black/30">
              <Globe className="h-5 w-5 text-gold" />
              <span>www.fmaltos.com.ar</span>
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/alacanchabb/" },
              { icon: Facebook, label: "Facebook", href: "#" },
              { icon: WhatsAppIcon, label: "WhatsApp", href: "#" },
              { icon: Twitch, label: "Twitch", href: TWITCH_URL },
              { icon: Youtube, label: "YouTube", href: YOUTUBE_URL },
            ].map((s) => (
              <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={s.label} className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-white/10 transition hover:bg-gold hover:text-gold-foreground">
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-bright">{eyebrow}</div>
      <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-primary sm:text-5xl">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gold" />
    </div>
  );
}

function ContactRow({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-black/20 px-4 py-3 backdrop-blur">
      <Icon className="h-5 w-5 text-gold" />
      <span>{label}</span>
    </div>
  );
}

function PaginatedGallery({ items, emptyText }: PaginatedGalleryProps) {

  const [page, setPage] = useState(1);
  // const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedImage =
    selectedIndex !== null ? items[selectedIndex] : null;

  const prevImage = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0
        ? items.length - 1
        : selectedIndex - 1
    );
  };

  const nextImage = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === items.length - 1
        ? 0
        : selectedIndex + 1
    );
  };

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedItems = items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") setSelectedIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  if (items.length === 0) {
    return (
      <p className="mt-10 text-center text-muted-foreground">
        {emptyText}
      </p>
    );
  }

  return (
    <>
      <div className="mt-12 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {/* {paginatedItems.map((item) => ( */}
        {paginatedItems.map((item, index) => {
          const globalIndex = (page - 1) * ITEMS_PER_PAGE + index;

          return (
            <figure
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={item.image_url}
                alt={item.name || "Imagen"}
                className="aspect-square w-full object-cover"
              />

              {item.name && (
                <figcaption className="p-3 text-center text-sm font-display uppercase tracking-wider text-primary">
                  {item.name}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Cerrar */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute right-6 top-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            ✕
          </button>

          {/* Contador superior */}
          <div className="absolute left-8 top-8 z-50 text-3xl font-light text-white">
            {selectedIndex! + 1}
            <span className="mx-2 text-white/50">/</span>
            {items.length}
          </div>

          {/* Flecha izquierda */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-6 top-1/2 z-50 flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-black/30 text-white shadow-[0_0_30px_rgba(255,215,0,0.15)] backdrop-blur transition hover:scale-105 hover:bg-black/50"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>

          {/* Flecha derecha */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-6 top-1/2 z-50 flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-black/30 text-white shadow-[0_0_30px_rgba(255,215,0,0.15)] backdrop-blur transition hover:scale-105 hover:bg-black/50"
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          {/* Imagen principal */}
          <div
            className="flex h-full w-full items-center justify-center px-24 py-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image_url}
              alt={selectedImage.name || "Imagen"}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}