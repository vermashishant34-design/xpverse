import { motion } from "framer-motion";
import { usePlayer, xpForLevel } from "@/store/player";

export function XPBar() {
  const p = usePlayer();
  const need = xpForLevel(p.level);
  const pct = Math.min(100, (p.xp / need) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-widest">
        <span className="text-muted-foreground">Lv {p.level}</span>
        <span className="text-muted-foreground">{p.xp} / {need} XP</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-secondary/60">
        <motion.div
          className="absolute inset-y-0 left-0 animate-aurora rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
        <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}
