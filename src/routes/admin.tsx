import { createFileRoute, Outlet, Navigate, Link, useRouter } from "@tanstack/react-router";
import { useSession } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const path = router.state.location.pathname;
  const { session, loading } = useSession();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-secondary text-muted-foreground">Cargando…</div>;
  }

  // /admin/login is always accessible
  if (path === "/admin/login") return <Outlet />;

  // any other admin route requires a session
  if (!session) return <Navigate to="/admin/login" />;

  // /admin → /admin/dashboard
  if (path === "/admin") return <Navigate to="/admin/dashboard" />;

  return <Outlet />;
}

export { Link };
