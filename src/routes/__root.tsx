import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="mt-4 text-2xl">page not found.</h1>
        <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-[0.2em] underline-offset-4 hover:underline">← back home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">error</p>
        <h1 className="mt-4 text-xl">something broke.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 text-xs uppercase tracking-[0.2em] underline underline-offset-4">retry</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Studio Nilo — independent design studio" },
      { name: "description", content: "Studio Nilo is an independent design studio crafting brand systems, digital products, and quiet interfaces." },
      { property: "og:title", content: "Studio Nilo — independent design studio" },
      { property: "og:description", content: "Brand systems, digital products, quiet interfaces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const NAV = [
  { to: "/", label: "index" },
  { to: "/work", label: "work" },
  { to: "/studio", label: "studio" },
  { to: "/contact", label: "contact" },
];

function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between text-xs uppercase tracking-[0.18em]">
        <Link to="/" className="font-mono text-foreground">studio nilo<span className="animate-blink">_</span></Link>
        <nav className="flex items-center gap-6 md:gap-8">
          {NAV.map((n) => {
            const active = path === n.to;
            return (
              <Link key={n.to} to={n.to} className={`relative transition ${active ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}>
                {n.label}
                {active && <span className="absolute -bottom-1 left-0 right-0 h-px bg-foreground" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        <div>
          <p className="uppercase tracking-[0.18em] text-muted-foreground mb-3">studio</p>
          <p className="text-foreground/80">Studio Nilo<br />Independent design practice<br />Est. 2024</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.18em] text-muted-foreground mb-3">contact</p>
          <a href="mailto:hello@studionilo.com" className="block hover:underline underline-offset-4">hello@studionilo.com</a>
          <a href="#" className="block hover:underline underline-offset-4 mt-1">+00 000 000 000</a>
        </div>
        <div>
          <p className="uppercase tracking-[0.18em] text-muted-foreground mb-3">elsewhere</p>
          <a href="#" className="block hover:underline underline-offset-4">instagram</a>
          <a href="#" className="block hover:underline underline-offset-4 mt-1">are.na</a>
          <a href="#" className="block hover:underline underline-offset-4 mt-1">linkedin</a>
        </div>
        <div className="md:text-right">
          <p className="uppercase tracking-[0.18em] text-muted-foreground mb-3">© 2026</p>
          <p className="text-foreground/60">All rights reserved.<br />Made with care.</p>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />
      <Footer />
    </QueryClientProvider>
  );
}
