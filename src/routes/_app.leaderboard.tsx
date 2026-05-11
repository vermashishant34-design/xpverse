import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Flame, Crown } from "lucide-react";
import { leaderboard } from "@/lib/game-data";
import { usePlayer } from "@/store/player";

export const Route = createFileRoute("/_app/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — XPVerse" }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const player = usePlayer();
  const merged = [...leaderboard, { rank: 99, name: player.username, level: player.level, xp: player.xp + player.level * 250, streak: player.streak, class: player.charClass }]
    .sort((a, b) => b.xp - a.xp).map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest font-display text-primary">// Global Rankings</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Leaderboard</h1>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {merged.slice(0, 3).map((p, i) => {
          const colors = ["var(--xp)", "var(--neon-cyan)", "var(--neon-purple)"];
          const heights = ["pt-4", "pt-10", "pt-14"];
          return (
            <motion.div
              key={p.name}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className={`glass rounded-2xl p-4 text-center ${heights[i]}`}
              style={{ boxShadow: i === 0 ? `0 0 30px ${colors[0]}50` : undefined }}
            >
              <Crown className="h-6 w-6 mx-auto" style={{ color: colors[i] }} />
              <div className="font-display text-2xl font-black mt-2" style={{ color: colors[i] }}>#{p.rank}</div>
              <div className="font-display font-bold text-sm mt-1 truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">Lv {p.level}</div>
              <div className="font-display text-sm mt-2" style={{ color: colors[i] }}>{p.xp.toLocaleString()} XP</div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-xs uppercase tracking-widest font-display text-muted-foreground border-b border-border/50">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Hero</div>
          <div className="col-span-2 text-right">Level</div>
          <div className="col-span-2 text-right">XP</div>
          <div className="col-span-2 text-right">Streak</div>
        </div>
        {merged.map((p, i) => {
          const isMe = p.name === player.username;
          return (
            <motion.div
              key={p.name + i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`grid grid-cols-12 px-5 py-4 items-center border-b border-border/30 last:border-0 transition hover:bg-primary/5 ${isMe ? "bg-primary/10" : ""}`}
            >
              <div className="col-span-1 font-display font-bold text-primary">{p.rank}</div>
              <div className="col-span-5 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-display font-semibold">{p.name} {isMe && <span className="text-xs text-primary">(you)</span>}</div>
                  <div className="text-xs text-muted-foreground capitalize">{p.class}</div>
                </div>
              </div>
              <div className="col-span-2 text-right font-display">Lv {p.level}</div>
              <div className="col-span-2 text-right font-display gradient-text font-bold">{p.xp.toLocaleString()}</div>
              <div className="col-span-2 text-right font-display flex items-center justify-end gap-1" style={{ color: "var(--neon-pink)" }}>
                <Flame className="h-3 w-3" /> {p.streak}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
