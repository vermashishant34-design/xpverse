import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Flame, Trophy, Zap, Swords, ArrowRight, Sparkles } from "lucide-react";
import { usePlayer, completeQuest } from "@/store/player";
import { rankForLevel, characterClasses } from "@/lib/game-data";
import { StatCard } from "@/components/StatCard";
import { XPBar } from "@/components/XPBar";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — XPVerse" }] }),
  component: Dashboard,
});

function Dashboard() {
  const player = usePlayer();
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [floatXP, setFloatXP] = useState<{ id: number; amount: number } | null>(null);
  const cls = characterClasses.find((c) => c.id === player.charClass) ?? characterClasses[0];
  const dailyQuests = player.quests.filter((q) => !q.completed).slice(0, 4);
  const recentAchievements = player.achievements.filter((a) => a.unlocked).slice(0, 3);

  const handleComplete = (id: string, xp: number) => {
    const result = completeQuest(id);
    setFloatXP({ id: Date.now(), amount: xp });
    setTimeout(() => setFloatXP(null), 1500);
    if (result?.leveledUp) {
      setLevelUp(result.newLevel);
      setTimeout(() => setLevelUp(null), 2800);
    }
    toast.success(`+${xp} XP earned`, { description: "Quest complete." });
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-display text-primary">// Welcome back</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">
            <span className="text-4xl mr-2">{player.avatar}</span>
            {player.username}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {cls.icon} {cls.name} · {rankForLevel(player.level)}
          </p>
        </div>
        <div className="glass rounded-xl px-5 py-3 text-right">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-display">Current Level</div>
          <div className="font-display text-3xl gradient-text font-bold">LV {player.level}</div>
        </div>
      </div>

      {/* XP bar */}
      <div className="glass rounded-2xl p-5">
        <XPBar xp={player.xp} level={player.level} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="XP Total" value={player.xp.toLocaleString()} icon={Zap} accent="cyan" />
        <StatCard label="Coins" value={player.coins.toLocaleString()} icon={Coins} accent="purple" />
        <StatCard label="Streak" value={`${player.streak} 🔥`} icon={Flame} accent="pink" />
        <StatCard label="Quests" value={player.quests.filter(q => q.completed).length} icon={Trophy} accent="green" />
      </div>

      {/* Daily quests + achievements */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" /> Daily Quests
            </h2>
            <Link to="/quests" className="text-xs font-display text-primary hover:underline flex items-center gap-1">
              All quests <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {dailyQuests.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">No active quests. Add one!</p>
            )}
            {dailyQuests.map((q) => (
              <motion.button
                key={q.id}
                whileHover={{ x: 4 }}
                onClick={() => handleComplete(q.id, q.xp)}
                className="w-full text-left flex items-center justify-between gap-4 p-3 rounded-xl border border-border/50 bg-background/30 hover:border-primary/50 hover:bg-primary/5 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                    <Swords className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-semibold truncate">{q.title}</div>
                    <div className="text-xs text-muted-foreground">{q.skill} · {q.difficulty}</div>
                  </div>
                </div>
                <div className="font-display font-bold text-sm" style={{ color: "var(--xp)" }}>+{q.xp} XP</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5" style={{ color: "var(--neon-purple)" }} /> Achievements
          </h2>
          <div className="space-y-3">
            {recentAchievements.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg bg-background/30">
                <div className="text-2xl">{a.icon}</div>
                <div>
                  <div className="font-display font-semibold text-sm">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill snapshot */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-display text-lg font-bold mb-4">Character Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(player.skills).map(([skill, lvl]) => (
            <div key={skill} className="text-center">
              <div className="relative h-20 w-20 mx-auto">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.25 0.05 270)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="url(#g1)" strokeWidth="8" strokeLinecap="round"
                    initial={{ strokeDasharray: "0 264" }}
                    animate={{ strokeDasharray: `${Math.min(lvl, 10) / 10 * 264} 264` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="oklch(0.85 0.18 195)" />
                      <stop offset="100%" stopColor="oklch(0.65 0.27 295)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg gradient-text">{lvl}</div>
              </div>
              <div className="text-xs uppercase tracking-wider mt-2 font-display text-muted-foreground">{skill}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating XP */}
      <AnimatePresence>
        {floatXP && (
          <motion.div
            key={floatXP.id}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -80, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 font-display text-4xl font-bold pointer-events-none z-50"
            style={{ color: "var(--xp)", textShadow: "0 0 20px var(--xp)" }}
          >
            +{floatXP.amount} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level up modal */}
      <AnimatePresence>
        {levelUp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.5 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="glass-strong rounded-3xl p-12 text-center max-w-md relative overflow-hidden"
              style={{ boxShadow: "var(--shadow-purple)" }}
            >
              <div className="absolute inset-0 opacity-60" style={{ background: "var(--gradient-glow)" }} />
              <div className="relative">
                <div className="text-7xl mb-4">🎉</div>
                <div className="text-xs uppercase tracking-widest font-display text-primary">Level Up</div>
                <div className="font-display text-6xl font-black gradient-text my-3">LV {levelUp}</div>
                <p className="text-muted-foreground">You've ascended to <span className="font-display text-primary">{rankForLevel(levelUp)}</span></p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
