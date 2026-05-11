import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MouseGlow } from "./MouseGlow";
import { usePlayer } from "@/store/player";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/quests", label: "Quests" },
  { to: "/skills", label: "Skills" },
  { to: "/achievements", label: "Achievements" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/ai", label: "AI Coach" },
] as const;

export function AppShell() {
  const loc = useLocation();
  const p = usePlayer();
  return (
    <div className="relative min-h-screen noise grid-bg">
      <MouseGlow />
      <header className="sticky top-0 z-40 glass-strong">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-md animate-aurora text-background">X</span>
            XPVERSE
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(n => {
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to}
                  className={`rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition ${active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <Link to="/profile" className="flex items-center gap-3 rounded-full glass px-3 py-1.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-background font-bold text-sm">{p.avatar}</span>
            <div className="hidden sm:block">
              <div className="text-xs font-mono">{p.username}</div>
              <div className="text-[10px] text-muted-foreground font-mono">Lv {p.level} · {p.coins}¤</div>
            </div>
          </Link>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.main
          key={loc.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-7xl px-6 py-12"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
