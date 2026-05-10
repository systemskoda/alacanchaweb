import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radio, Calendar, Mic, Trophy, Instagram, Facebook, MessageCircle, MapPin, Clock, Globe, ArrowRight, Twitch, Youtube, Tv } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-stadium.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

type Audio = { id: string; title: string; description: string; audio_url: string; published_at: string | null; is_featured?: boolean };
type Sponsor = { id: string; name: string; image_url: string };
type Match = { id: string; title: string; description: string; cover_image_url: string | null; stream_url: string | null; match_date: string | null };
type Guest = { id: string; name: string; image_url: string };

const TWITCH_URL = "https://www.twitch.tv/radioaltos979";
const YOUTUBE_URL = "https://www.youtube.com/@ALACANCHARADIO";

const team = [
  { name: "Fabián Rodríguez", role: "Conductor" },
  { name: "Mariano Rossi", role: "Coconductor" },
  { name: "Gustavo Pie", role: "Coconductor" },
];

const RADIO_WEB = "https://www.fmaltos.com.ar";

function Home() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [latestAudio, setLatestAudio] = useState<Audio | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [matchOfDay, setMatchOfDay] = useState<Match | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);

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
              <h1 className="font-display text-5xl font-bold leading-none tracking-tight text-balance sm:text-6xl">
                A LA <span className="text-gold">CANCHA</span>
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

      {/* Invitados */}
      <section id="invitados" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Pasaron por el aire" title="Invitados" />
          {guests.length === 0 ? (
            <p className="mt-10 text-center text-muted-foreground">Próximamente: galería de invitados al programa.</p>
          ) : (
            <div className="mt-12 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {guests.map((g) => (
                <figure key={g.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <img src={g.image_url} alt={g.name || "Invitado"} className="aspect-square w-full object-cover" />
                  {g.name && (
                    <figcaption className="p-3 text-center text-sm font-display uppercase tracking-wider text-primary">{g.name}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
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
            <Link to="/notas">
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
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/alacanchabb/" },
              { icon: Facebook, label: "Facebook", href: "#" },
              { icon: MessageCircle, label: "WhatsApp", href: "#" },
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
