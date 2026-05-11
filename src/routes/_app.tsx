import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar, MobileNav } from "@/components/AppSidebar";
import { ParticleBackground } from "@/components/ParticleBackground";
import { useHydratePlayer } from "@/store/player";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  useHydratePlayer();
  return (
    <div className="flex min-h-screen">
      <ParticleBackground count={25} />
      <AppSidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
