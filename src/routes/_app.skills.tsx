import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Dumbbell, BookOpen, MessageCircle, Target } from "lucide-react";
import { usePlayer } from "@/store/player";
import type { Skill } from "@/lib/game-data";

export const Route = createFileRoute("/_app/skills")({
  head: () => ({ meta: [{ title: "Skill Tree — XPVerse" }] }),
  component: SkillsPage,
});

const skillMeta: Record<Skill, { icon: typeof Brain; color: string; desc: string }> = {
  Intelligence: { icon: Brain, color: "var(--neon-cyan)", desc: "Logic, code, learning velocity." },
  Strength: { icon: Dumbbell, color: "var(--neon-pink)", desc: "Body, energy, physical resilience." },
  Wisdom: { icon: BookOpen, color: "var(--neon-purple)", desc: "Insight, reading, deep thinking." },
  Charisma: { icon: MessageCircle, color: "var(--neon-blue)", desc: "Influence, networking, presence." },
  Discipline: { icon: Target, color: "var(--neon-green)", desc: "Focus, habits, willpower." },
};

function SkillsPage() {
  const player = usePlayer();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest font-display text-primary">// Skill Matrix</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Skill Tree</h1>
        <p className="text-sm text-muted-foreground mt-2">Complete quests in each domain to grow your skill levels.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(Object.keys(skillMeta) as Skill[]).map((s, i) => {
          const meta = skillMeta[s];
          const Icon = meta.icon;
          const lvl = player.skills[s];
          const pct = Math.min(100, (lvl / 10) * 100);
          return (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: meta.color }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex p-3 rounded-xl" style={{ background: meta.color, boxShadow: `0 0 20px ${meta.color}80` }}>
                    <Icon className="h-5 w-5 text-background" />
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl font-bold" style={{ color: meta.color }}>{lvl}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-display">/ 10</div>
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold">{s}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{meta.desc}</p>
                <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: meta.color, boxShadow: `0 0 10px ${meta.color}` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
