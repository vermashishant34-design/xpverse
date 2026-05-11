import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Swords, Sparkles, Trophy, Timer, User, Settings, Zap } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/quests", label: "Quests", icon: Swords },
  { to: "/skills", label: "Skill Tree", icon: Sparkles },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/pomodoro", label: "Focus Timer", icon: Timer },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-60 flex-col glass-strong border-r border-border/50 p-4 gap-2">
      <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-2">
        <div className="relative">
          <Zap className="h-7 w-7 text-primary" />
          <div className="absolute inset-0 blur-md bg-primary/50 -z-10" />
        </div>
        <span className="font-display text-xl font-bold gradient-text">XPVerse</span>
      </Link>
      {items.map((item) => {
        const active = path === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              active
                ? "text-primary bg-primary/10 border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            {active && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/30 -z-10"
                style={{ boxShadow: "var(--shadow-neon)" }}
                transition={{ type: "spring", duration: 0.4 }}
              />
            )}
            <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
            {item.label}
          </Link>
        );
      })}
      <div className="mt-auto glass rounded-xl p-3 text-xs text-muted-foreground">
        <p className="font-display text-primary mb-1">SYSTEM</p>
        <p>v1.0 — Online</p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 glass-strong rounded-2xl px-2 py-2 flex justify-around">
      {items.slice(0, 5).map((item) => {
        const active = path === item.to;
        const Icon = item.icon;
        return (
          <Link key={item.to} to={item.to} className={`p-2 rounded-lg ${active ? "text-primary" : "text-muted-foreground"}`}>
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </nav>
  );
}
