import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { usePlayer } from "@/store/player";
import { characterClasses, rankForLevel } from "@/lib/game-data";
import { Coins, Flame, Trophy, Zap } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — XPVerse" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const player = usePlayer();
  const cls = characterClasses.find((c) => c.id === player.charClass) ?? characterClasses[0];
  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-3xl p-8 relative overflow-hidden" style={{ boxShadow: "var(--shadow-purple)" }}>
        <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-32 w-32 rounded-2xl flex items-center justify-center text-6xl glass" style={{ boxShadow: "var(--shadow-neon)" }}>
            {player.avatar}
          </div>
          <div className="text-center md:text-left flex-1">
            <p className="text-xs uppercase tracking-widest font-display text-primary">{cls.icon} {cls.name}</p>
            <h1 className="font-display text-4xl font-black mt-1">{player.username}</h1>
            <p className="text-muted-foreground mt-1">Rank: <span className="text-primary font-display">{rankForLevel(player.level)}</span> · Level {player.level}</p>
            <p className="text-sm text-muted-foreground mt-3 max-w-md">{cls.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "XP", v: player.xp.toLocaleString(), i: Zap },
          { l: "Coins", v: player.coins.toLocaleString(), i: Coins },
          { l: "Streak", v: player.streak, i: Flame },
          { l: "Quests", v: player.quests.filter(q => q.completed).length, i: Trophy },
        ].map((s) => (
          <div key={s.l} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground"><s.i className="h-4 w-4" /><span className="text-xs uppercase tracking-widest font-display">{s.l}</span></div>
            <div className="font-display text-2xl font-bold gradient-text mt-2">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg font-bold mb-4">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {player.achievements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              className={`p-4 rounded-xl border ${a.unlocked ? "border-primary/40 bg-primary/5" : "border-border bg-background/30 opacity-50"}`}
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="font-display font-bold">{a.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{a.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
