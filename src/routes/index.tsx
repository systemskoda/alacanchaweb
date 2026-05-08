import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radio, Calendar, Mic, Trophy, Instagram, Facebook, MessageCircle, MapPin, Clock, Globe, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

type Audio = { id: string; title: string; description: string; audio_url: string; published_at: string | null };
type Sponsor = { id: string; name: string; image_url: string };

const team = [
  { name: "Fabián Rodríguez", role: "Conductor" },
  { name: "Mariano Rossi", role: "Columnista" },
  { name: "Gustavo Pie", role: "Columnista" },
];

const RADIO_WEB = "https://www.fmaltos.com.ar";

function Home() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [latestAudio, setLatestAudio] = useState<Audio | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    supabase.from("audios").select("*").order("published_at", { ascending: false }).limit(4).then(({ data }) => {
      const list = data ?? [];
      setLatestAudio(list[0] ?? null);
      setAudios(list.slice(1, 4));
    });
    supabase.from("sponsors").select("*").eq("active", true).order("created_at", { ascending: false }).then(({ data }) => setSponsors(data ?? []));
  }, []);

  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-pitch relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-20 text-primary-foreground">
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/20 px-4 py-1.5 text-xs uppercase tracking-widest text-gold backdrop-blur">
              <Radio className="h-3.5 w-3.5" /> En vivo · 97.9 FM
            </div>
            <h1 className="font-display text-6xl font-bold leading-none tracking-tight text-balance sm:text-7xl md:text-8xl">
              A LA <span className="text-gold">CANCHA</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl lg:mx-0 mx-auto">
              Programa integral de deportes donde la información y los protagonistas cobran voz.
            </p>
            <div className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-5 py-3 text-sm backdrop-blur">
              <Radio className="h-4 w-4 text-gold" />
              <span className="font-semibold">Radio Altos Bahía Blanca 97.9</span>
              <span className="opacity-60">·</span>
              <span>Lun a Vie 19 a 21hs</span>
            </div>
            <a href={RADIO_WEB} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center lg:justify-start gap-2 text-sm text-gold hover:underline">
              <Globe className="h-4 w-4" /> www.fmaltos.com.ar
            </a>
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
              <Button size="lg" onClick={() => scroll("notas")} className="bg-gold text-gold-foreground hover:bg-gold/90 font-display uppercase tracking-wider">
                Ver Notas
              </Button>
              <a href={RADIO_WEB} target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 font-display uppercase tracking-wider">
                  Radio Altos
                </Button>
              </a>
            </div>
          </div>

          {/* Last audio card */}
          <div className="rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur shadow-2xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
              <Mic className="h-3.5 w-3.5" /> Último audio
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
                <p className="mt-2 text-sm text-white/75">El último audio publicado aparecerá aquí.</p>
                <div className="mt-4 h-12 rounded-md bg-white/10" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Acompañan" title="Sponsors" />
          <div className="mt-10 overflow-x-auto">
            <div className="flex gap-6 pb-4">
              {(sponsors.length ? sponsors : Array.from({ length: 6 }).map((_, i) => ({ id: `ph-${i}`, name: "", image_url: "" }) as Sponsor)).map((s) => (
                <div key={s.id} className="flex h-28 w-44 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-card p-4 shadow-sm">
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

      {/* About */}
      <section id="programa" className="bg-secondary px-4 py-20 sm:py-24">
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
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Quiénes somos" title="El Equipo" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div key={m.name} className="overflow-hidden rounded-xl bg-card shadow-md transition hover:-translate-y-1 hover:shadow-xl border border-border">
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

      {/* Notas Recientes (audios) */}
      <section id="notas" className="bg-secondary px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Escuchá" title="Notas Recientes" />
          <div className="mt-12 space-y-4">
            {(audios.length ? audios : Array.from({ length: 3 }).map((_, i) => ({
              id: `ph-${i}`, title: "Nota próximamente", description: "Las notas del programa aparecerán aquí.", audio_url: "", published_at: null,
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
          <div className="mt-10 text-center">
            <Link to="/notas" target="_blank">
              <Button size="lg" className="bg-primary hover:bg-primary-bright font-display uppercase tracking-wider">
                Escuchar más notas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
            <a href={RADIO_WEB} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-white/15 bg-black/20 px-4 py-3 backdrop-blur transition hover:bg-black/30">
              <Globe className="h-5 w-5 text-gold" />
              <span>www.fmaltos.com.ar</span>
            </a>
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
