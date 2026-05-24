import { motion } from "framer-motion";
import { usePlayer, xpForLevel } from "@/store/player";
import { XPBar } from "@/components/XPBar";
import { NotificationsFeed } from "@/components/NotificationsFeed";

export default function Dashboard() {
  const p = usePlayer();
  const completed = p.quests.filter(q => q.done).length;
  const stats = [
    { label: "Level", value: p.level, sub: `${p.xp} / ${xpForLevel(p.level)} XP` },
    { label: "Streak", value: `${p.streak}🔥`, sub: p.streak > 0 ? "Keep it alive" : "Start today" },
    { label: "Coins", value: `${p.coins}¤`, sub: "Currency earned" },
    { label: "Quests", value: `${completed}/${p.quests.length}`, sub: "Completed" },
  ];
  return (
    <div className="space-y-12">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">— Operator HUD</p>
        <h1 className="mt-3 font-display text-5xl md:text-7xl font-bold tracking-tighter">
          Welcome back, <span className="gradient-text">{p.username}.</span>
        </h1>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl glass p-6 hover:scale-[1.02] transition"
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
            <div className="mt-2 font-display text-3xl font-bold">{s.value}</div>
            <div className="mt-1 font-mono text-xs text-muted-foreground">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl glass p-8">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-neon-cyan">Progression</div>
        <XPBar />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl glass p-6">
          <h3 className="font-display text-xl font-semibold">Active Quests</h3>
          <ul className="mt-4 space-y-3">
            {p.quests.filter(q => !q.done).slice(0, 4).map(q => (
              <li key={q.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <span className="text-sm">{q.title}</span>
                <span className="font-mono text-xs text-neon-cyan">+{q.xp} XP</span>
              </li>
            ))}
            {p.quests.filter(q => !q.done).length === 0 && <li className="text-sm text-muted-foreground">All quests cleared. Legendary.</li>}
          </ul>
        </div>
        <div className="rounded-2xl glass p-6">
          <h3 className="font-display text-xl font-semibold">Skill Stats</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(p.skills).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                  <span>{k}</span><span className="text-muted-foreground">{v}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary/60">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, v * 5)}%` }}
                    transition={{ duration: 0.8 }} className="h-full animate-aurora" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <NotificationsFeed />
      </div>
    </div>
  );
}
