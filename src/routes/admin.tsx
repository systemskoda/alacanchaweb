import { createFileRoute, Outlet, Navigate, useRouter } from "@tanstack/react-router";
import { useSession } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const path = router.state.location.pathname;
  const { session, loading } = useSession();

  // Login page is always accessible
  if (path.startsWith("/admin/login")) return <Outlet />;

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-secondary text-muted-foreground">Cargando…</div>;
  }

  if (!session) return <Navigate to="/admin/login" />;

  return <Outlet />;
}
