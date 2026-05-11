import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label, value, icon: Icon, accent = "cyan",
}: { label: string; value: string | number; icon: LucideIcon; accent?: "cyan" | "purple" | "pink" | "green" }) {
  const colorMap = {
    cyan: "var(--neon-cyan)",
    purple: "var(--neon-purple)",
    pink: "var(--neon-pink)",
    green: "var(--neon-green)",
  } as const;
  const color = colorMap[accent];
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass relative overflow-hidden rounded-xl p-4 group"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" style={{ background: color }} />
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-display">{label}</span>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="text-2xl font-display font-bold" style={{ color, textShadow: `0 0 12px ${color}80` }}>{value}</div>
    </motion.div>
  );
}
