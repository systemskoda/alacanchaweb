import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/relatos")({
  component: NotasPage,
});

type Relato = { id: string; title: string; description: string; relato_url: string; published_at: string | null };

function NotasPage() {
  const [items, setItems] = useState<Relato[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("relatos_goles").select("*").order("published_at", { ascending: false }).then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((a) => a.title.toLowerCase().includes(s));
  }, [items, q]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-pitch px-4 py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          <h1 className="mt-4 font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl">
            Todos los <span className="text-gold">Relatos</span>
          </h1>
          <p className="mt-2 text-white/80">El archivo completo de relatos de A LA CANCHA.</p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por título…"
              className="h-14 pl-12 text-base"
            />
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {loading ? "Cargando…" : `${filtered.length} ${filtered.length === 1 ? "relato" : "relatos"}`}
          </div>

          <div className="mt-6 space-y-4">
            {!loading && filtered.length === 0 && (
              <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                No encontramos relatos que coincidan con "{q}".
              </div>
            )}
            {filtered.map((r) => (
              <article key={r.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-primary">{r.title}</h3>
                    {r.description && <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>}
                  </div>
                  <time className="shrink-0 text-xs uppercase tracking-widest text-muted-foreground">
                    {r.published_at ? new Date(r.published_at).toLocaleDateString("es-AR") : "—"}
                  </time>
                </div>
                {r.relato_url && <audio controls className="mt-4 w-full" src={r.relato_url} />}
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/">
              <Button variant="outline" className="font-display uppercase tracking-wider">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}