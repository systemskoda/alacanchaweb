import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Radio } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido");
        navigate({ to: "/admin/dashboard" });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Ya podés ingresar.");
        setMode("signin");
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pitch grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-center gap-2 text-primary">
          <Radio className="h-5 w-5 text-gold" />
          <span className="font-display text-2xl font-bold tracking-wide">A LA CANCHA</span>
        </div>
        <h1 className="text-center font-display text-2xl font-semibold text-primary">Panel de administración</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">{mode === "signin" ? "Ingresá con tu cuenta" : "Creá una cuenta de admin"}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary font-display uppercase tracking-wider hover:bg-primary-bright">
            {loading ? "..." : mode === "signin" ? "Ingresar" : "Crear cuenta"}
          </Button>
        </form>

        <button onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))} className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-primary">
          {mode === "signin" ? "¿No tenés cuenta? Crear una" : "¿Ya tenés cuenta? Ingresar"}
        </button>
      </div>
    </div>
  );
}
