import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radio, Calendar, Mic, Trophy, Instagram, Facebook, MessageCircle, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

type Article = { id: string; title: string; content: string; image_url: string | null; published_at: string | null };
type Audio = { id: string; title: string; description: string; audio_url: string; published_at: string | null };
type Sponsor = { id: string; name: string; image_url: string };

const team = [
  { name: "Fabián Rodríguez", role: "Conductor" },
  { name: "Mariano Rossi", role: "Columnista" },
  { name: "Gustavo Pie", role: "Columnista" },
];

function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [audios, setAudios] = useState<Audio[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    supabase.from("articles").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(3).then(({ data }) => setArticles(data ?? []));
    supabase.from("audios").select("*").order("published_at", { ascending: false }).limit(5).then(({ data }) => setAudios(data ?? []));
    supabase.from("sponsors").select("*").eq("active", true).order("created_at", { ascending: false }).then(({ data }) => setSponsors(data ?? []));
  }, []);

  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-pitch relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-20 text-primary-foreground">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/20 px-4 py-1.5 text-xs uppercase tracking-widest text-gold backdrop-blur">
            <Radio className="h-3.5 w-3.5" /> En vivo · 97.9 FM
          </div>
          <h1 className="font-display text-6xl font-bold leading-none tracking-tight text-balance sm:text-7xl md:text-8xl lg:text-9xl">
            A LA <span className="text-gold">CANCHA</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85 sm:text-xl">
            Programa integral de deportes donde la información y los protagonistas cobran voz.
          </p>
          <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-lg border border-white/15 bg-black/30 px-5 py-3 text-sm backdrop-blur">
            <Radio className="h-4 w-4 text-gold" />
            <span className="font-semibold">Radio Altos Bahía Blanca 97.9</span>
            <span className="opacity-60">·</span>
            <span>Lunes a Viernes 19 a 21hs</span>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => scroll("notas")} className="bg-gold text-gold-foreground hover:bg-gold/90 font-display uppercase tracking-wider">
              Ver Notas
            </Button>
            <Button size="lg" variant="outline" onClick={() => scroll("audio")} className="border-white/40 bg-transparent text-white hover:bg-white/10 font-display uppercase tracking-wider">
              Escuchar Audios
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="programa" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="Sobre el ciclo" title="El Programa" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-muted-foreground">
            Con más de 5.000 emisiones y 18 años al aire en los medios bahienses, A la Cancha busca ofrecer un ciclo ameno y compartir nuestra pasión con los amantes de todas las disciplinas deportivas. Moderno, ágil y comprometido socialmente.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Mic, value: "5.000+", label: "Emisiones" },
              { icon: Calendar, value: "18", label: "Años al aire" },
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
      <section className="bg-secondary px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Quiénes somos" title="El Equipo" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div key={m.name} className="overflow-hidden rounded-xl bg-card shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                <div className="bg-pitch flex aspect-square items-center justify-center text-primary-foreground/40">
                  <Trophy className="h-20 w-20" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-display text-xl font-semibold text-primary">{m.name}</h3>
                  <p className="mt-1 text-sm uppercase tracking-widest text-primary-bright">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notas */}
      <section id="notas" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Lo último" title="Últimas Notas" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(articles.length ? articles : Array.from({ length: 3 }).map((_, i) => ({
              id: `ph-${i}`, title: "Próximamente", content: "Las novedades del programa aparecerán aquí muy pronto.", image_url: null, published_at: null,
            }) as Article)).map((a) => (
              <article key={a.id} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-video overflow-hidden bg-secondary">
                  {a.image_url ? (
                    <img src={a.image_url} alt={a.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="bg-pitch h-full w-full" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <time className="text-xs uppercase tracking-widest text-muted-foreground">
                    {a.published_at ? new Date(a.published_at).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" }) : "Próximamente"}
                  </time>
                  <h3 className="mt-2 font-display text-xl font-semibold text-primary">{a.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{a.content}</p>
                  <button className="mt-4 self-start font-display text-sm uppercase tracking-widest text-primary-bright hover:text-gold">
                    Leer más →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Audios */}
      <section id="audio" className="bg-secondary px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Escuchá" title="Audios Recientes" />
          <div className="mt-12 space-y-4">
            {(audios.length ? audios : Array.from({ length: 3 }).map((_, i) => ({
              id: `ph-${i}`, title: "Audio próximamente", description: "Los audios del programa aparecerán aquí.", audio_url: "", published_at: null,
            }) as Audio)).map((a) => (
              <div key={a.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-primary">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  </div>
                  <time className="shrink-0 text-xs uppercase tracking-widest text-muted-foreground">
                    {a.published_at ? new Date(a.published_at).toLocaleDateString("es-AR") : "—"}
                  </time>
                </div>
                {a.audio_url ? (
                  <audio controls className="mt-4 w-full" src={a.audio_url} />
                ) : (
                  <div className="mt-4 h-12 rounded-md bg-secondary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Acompañan" title="Sponsors" />
          <div className="mt-12 overflow-x-auto">
            <div className="flex gap-6 pb-4">
              {(sponsors.length ? sponsors : Array.from({ length: 6 }).map((_, i) => ({ id: `ph-${i}`, name: "", image_url: "" }) as Sponsor)).map((s) => (
                <div key={s.id} className="flex h-32 w-48 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-card p-4 shadow-sm">
                  {s.image_url ? (
                    <img src={s.image_url} alt={s.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <Trophy className="h-10 w-10 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
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
          </div>
          <div className="mt-10 flex justify-center gap-3">
            {[
              { icon: Instagram, label: "Instagram" },
              { icon: Facebook, label: "Facebook" },
              { icon: MessageCircle, label: "WhatsApp" },
            ].map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-white/10 transition hover:bg-gold hover:text-gold-foreground">
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
