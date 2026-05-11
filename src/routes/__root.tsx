import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">404 — out of bounds</p>
        <h1 className="mt-4 font-display text-5xl font-bold gradient-text">Lost in the verse</h1>
        <a href="/" className="mt-6 inline-block font-mono text-xs uppercase tracking-widest underline-offset-4 hover:underline">← Return home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-destructive">system fault</p>
        <h1 className="mt-3 font-display text-3xl font-bold">Something glitched</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md glass px-4 py-2 font-mono text-xs uppercase tracking-widest">retry</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "XPVerse — Turn Your Life Into A Game" },
      { name: "description", content: "A cinematic gamified productivity RPG. Level up your real life with XP, quests, skills, and achievements." },
      { property: "og:title", content: "XPVerse — Turn Your Life Into A Game" },
      { property: "og:description", content: "A futuristic self-improvement game. Real tasks. Real XP. Real you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}
