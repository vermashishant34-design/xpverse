import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { usePlayer } from "@/store/player";

const RARITY: Record<string, string> = {
  common: "from-muted-foreground to-muted",
  rare: "from-neon-blue to-neon-cyan",
  epic: "from-neon-purple to-neon-blue",
  legendary: "from-neon-cyan via-neon-purple to-accent",
};

export const Route = createFileRoute("/_app/achievements")({
  head: () => ({ meta: [{ title: "Achievements — XPVerse" }] }),
  component: Achievements,
});

function Achievements() {
  const p = usePlayer();
  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">— Trophy Hall</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold tracking-tighter">Achievements</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {p.achievements.map((a, i) => (
          <motion.div key={a.id}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`group relative overflow-hidden rounded-2xl glass p-6 ${a.unlocked ? "" : "opacity-40"}`}
          >
            <div className={`mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br ${RARITY[a.rarity]} ${a.unlocked ? "animate-pulse-glow" : ""}`}>
              <span className="font-display text-3xl font-bold text-background">★</span>
            </div>
            <div className="mt-4 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">{a.rarity}</div>
              <h3 className="mt-1 font-display text-lg font-semibold">{a.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-widest">{a.unlocked ? "Unlocked" : "Locked"}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
