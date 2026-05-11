import { motion } from "framer-motion";
import { xpForLevel } from "@/lib/game-data";

export function XPBar({ xp, level }: { xp: number; level: number }) {
  const need = xpForLevel(level);
  const pct = Math.min(100, (xp / need) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-display uppercase tracking-wider">
        <span className="text-muted-foreground">XP</span>
        <span className="text-primary">{xp} / {need}</span>
      </div>
      <div className="relative h-3 rounded-full bg-muted/40 overflow-hidden border border-primary/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{
            background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))",
            boxShadow: "0 0 12px var(--neon-cyan)",
          }}
        >
          <div className="absolute inset-0 shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
