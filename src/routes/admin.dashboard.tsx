import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mic, Image as ImgIcon, Trophy, LogOut, Plus, Pencil, Trash2, Radio } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

type Tab = "audios" | "sponsors" | "images";

function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("audios");

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "audios", label: "Notas", icon: Mic },
    { id: "sponsors", label: "Sponsors", icon: Trophy },
    { id: "images", label: "Imágenes", icon: ImgIcon },
  ];

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <Radio className="h-5 w-5 text-gold" />
          <span className="font-display text-lg font-bold tracking-wide">A LA CANCHA</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 font-display text-sm uppercase tracking-wider transition ${
                tab === t.id ? "bg-gold text-gold-foreground" : "hover:bg-white/10"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="m-3 flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm hover:bg-white/10">
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t bg-primary text-primary-foreground">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-3 text-xs ${tab === t.id ? "text-gold" : ""}`}>
            <t.icon className="mx-auto mb-1 h-4 w-4" />{t.label}
          </button>
        ))}
        <button onClick={logout} className="flex-1 py-3 text-xs">
          <LogOut className="mx-auto mb-1 h-4 w-4" />Salir
        </button>
      </div>

      <main className="flex-1 p-6 pb-24 md:p-10">
        {tab === "audios" && <AudiosPanel />}
        {tab === "sponsors" && <SponsorsPanel />}
        {tab === "images" && <ImagesPanel />}
      </main>
    </div>
  );
}

function PanelHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="font-display text-3xl font-bold uppercase text-primary">{title}</h1>
      {action}
    </div>
  );
}

/* ---------------- AUDIOS ---------------- */
type Audio = { id: string; title: string; description: string; audio_url: string; published_at: string | null };

function AudiosPanel() {
  const [items, setItems] = useState<Audio[]>([]);
  const [editing, setEditing] = useState<Audio | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("audios").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const file = fd.get("file") as File | null;
      let audio_url = editing?.audio_url ?? "";
      if (file && file.size > 0) {
        const path = `${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("audios").upload(path, file);
        if (upErr) throw upErr;
        audio_url = supabase.storage.from("audios").getPublicUrl(path).data.publicUrl;
      }
      if (!audio_url) throw new Error("Subí un archivo MP3");

      const payload = {
        title: String(fd.get("title")),
        description: String(fd.get("description")),
        audio_url,
        published_at: fd.get("published_at") ? new Date(String(fd.get("published_at"))).toISOString() : new Date().toISOString(),
      };
      const { error } = editing
        ? await supabase.from("audios").update(payload).eq("id", editing.id)
        : await supabase.from("audios").insert(payload);
      if (error) throw error;
      toast.success("Audio guardado");
      setOpen(false); setEditing(null); load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este audio?")) return;
    const { error } = await supabase.from("audios").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Eliminado"); load();
  };

  return (
    <>
      <PanelHeader title="Notas" action={
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)} className="bg-primary hover:bg-primary-bright">
              <Plus className="mr-2 h-4 w-4" /> Nueva nota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Editar nota" : "Nueva nota"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div><Label>Título</Label><Input name="title" required defaultValue={editing?.title} /></div>
              <div><Label>Descripción</Label><Textarea name="description" rows={4} defaultValue={editing?.description} /></div>
              <div>
                <Label>Archivo MP3 {editing && "(opcional, dejar vacío para mantener)"}</Label>
                <Input name="file" type="file" accept="audio/*" required={!editing} />
              </div>
              <div>
                <Label>Fecha</Label>
                <Input type="datetime-local" name="published_at" defaultValue={editing?.published_at?.slice(0, 16) ?? new Date().toISOString().slice(0, 16)} />
              </div>
              <DialogFooter><Button type="submit" disabled={uploading} className="bg-primary">{uploading ? "Subiendo…" : "Guardar"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      } />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left font-display uppercase tracking-wider text-xs text-muted-foreground">
            <tr><th className="p-4">Título</th><th className="p-4">Fecha</th><th className="p-4 text-right">Acciones</th></tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">Sin audios todavía</td></tr>}
            {items.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-4 font-medium">{a.title}</td>
                <td className="p-4 text-muted-foreground">{a.published_at ? new Date(a.published_at).toLocaleDateString("es-AR") : "—"}</td>
                <td className="p-4 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------------- SPONSORS ---------------- */
type Sponsor = { id: string; name: string; image_url: string; active: boolean };

function SponsorsPanel() {
  const [items, setItems] = useState<Sponsor[]>([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("sponsors").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const file = fd.get("file") as File;
      if (!file || file.size === 0) throw new Error("Seleccioná una imagen");
      const path = `${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("sponsors").upload(path, file);
      if (upErr) throw upErr;
      const url = supabase.storage.from("sponsors").getPublicUrl(path).data.publicUrl;
      const { error } = await supabase.from("sponsors").insert({ name: String(fd.get("name")) || file.name, image_url: url, active: true });
      if (error) throw error;
      toast.success("Sponsor agregado");
      setOpen(false); load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (s: Sponsor) => {
    if (!confirm("¿Eliminar este sponsor?")) return;
    try {
      const path = s.image_url.split("/sponsors/")[1];
      if (path) await supabase.storage.from("sponsors").remove([path]);
      const { error } = await supabase.from("sponsors").delete().eq("id", s.id);
      if (error) throw error;
      toast.success("Eliminado"); load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  return (
    <>
      <PanelHeader title="Sponsors" action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-bright"><Plus className="mr-2 h-4 w-4" /> Agregar sponsor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo sponsor</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div><Label>Nombre</Label><Input name="name" placeholder="Opcional" /></div>
              <div><Label>Imagen (JPG/PNG)</Label><Input name="file" type="file" accept="image/*" required /></div>
              <DialogFooter><Button type="submit" disabled={uploading} className="bg-primary">{uploading ? "Subiendo…" : "Guardar"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      } />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">Sin sponsors todavía</p>}
        {items.map((s) => (
          <div key={s.id} className="group relative aspect-square rounded-xl border-2 bg-card p-4 shadow-sm">
            <img src={s.image_url} alt={s.name} className="h-full w-full object-contain" />
            <Button size="icon" variant="destructive" onClick={() => remove(s)} className="absolute right-2 top-2 h-8 w-8 opacity-0 transition group-hover:opacity-100">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- IMAGES ---------------- */
type Img = { id: string; url: string; filename: string };

function ImagesPanel() {
  const [items, setItems] = useState<Img[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("images").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("images").upload(path, file);
      if (upErr) throw upErr;
      const url = supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
      const { error } = await supabase.from("images").insert({ url, filename: file.name });
      if (error) throw error;
      toast.success("Imagen subida"); load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const remove = async (i: Img) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      const path = i.url.split("/images/")[1];
      if (path) await supabase.storage.from("images").remove([path]);
      const { error } = await supabase.from("images").delete().eq("id", i.id);
      if (error) throw error;
      toast.success("Eliminada"); load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  return (
    <>
      <PanelHeader title="Imágenes" action={
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-bright">
          <Plus className="h-4 w-4" /> {uploading ? "Subiendo…" : "Subir imagen"}
          <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={uploading} />
        </label>
      } />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">Sin imágenes todavía</p>}
        {items.map((i) => (
          <div key={i.id} className="group relative overflow-hidden rounded-xl border bg-card shadow-sm">
            <img src={i.url} alt={i.filename} className="aspect-square w-full object-cover" />
            <div className="p-2 text-xs text-muted-foreground truncate">{i.filename}</div>
            <Button size="icon" variant="destructive" onClick={() => remove(i)} className="absolute right-2 top-2 h-8 w-8 opacity-0 transition group-hover:opacity-100">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
