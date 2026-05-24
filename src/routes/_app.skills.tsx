import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { usePlayer } from "@/store/player";

export const Route = createFileRoute("/_app/skills")({
  head: () => ({ meta: [{ title: "Skill Tree — XPVerse" }] }),
  component: Skills,
});

function Skills() {
  const p = usePlayer();
  const skills = Object.entries(p.skills);
  return (
    <div className="space-y-12">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">— Skill Matrix</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold tracking-tighter">The Tree</h1>
      </header>

      <div className="relative grid place-items-center min-h-[600px] rounded-3xl glass overflow-hidden p-12">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {skills.map((_, i) => {
            const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(angle) * 35;
            const y = 50 + Math.sin(angle) * 35;
            return (
              <line key={i} x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`}
                stroke="url(#g)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            );
          })}
          <defs>
            <linearGradient id="g">
              <stop offset="0%" stopColor="oklch(0.7 0.22 255)" />
              <stop offset="100%" stopColor="oklch(0.7 0.25 305)" />
            </linearGradient>
          </defs>
        </svg>

        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
          className="relative z-10 grid h-40 w-40 place-items-center rounded-full glass-strong glow"
        >
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">Core</div>
            <div className="font-display text-5xl font-bold gradient-text">{p.level}</div>
          </div>
        </motion.div>

        {skills.map(([name, val], i) => {
          const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
          const pct = Math.min(100, val * 8);
          return (
            <motion.div key={name}
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              className="absolute"
              style={{
                left: `calc(50% + ${Math.cos(angle) * 38}% - 80px)`,
                top: `calc(50% + ${Math.sin(angle) * 38}% - 80px)`,
              }}
            >
              <div className="relative grid h-[160px] w-[160px] place-items-center rounded-full glass hover:glow transition">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="72" fill="none" stroke="oklch(1 0 0 / 0.05)" strokeWidth="3" />
                  <motion.circle cx="80" cy="80" r="72" fill="none" stroke="url(#g)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 72}
                    initial={{ strokeDashoffset: 2 * Math.PI * 72 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 72 * (1 - pct / 100) }}
                    transition={{ duration: 1.2, delay: 0.4 + i * 0.1 }} />
                </svg>
                <div className="text-center px-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground break-words">{name}</div>
                  <div className="font-display text-3xl font-bold mt-1">{val}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
