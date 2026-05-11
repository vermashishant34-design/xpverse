import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { addXP } from "@/store/player";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pomodoro")({
  head: () => ({ meta: [{ title: "Focus Timer — XPVerse" }] }),
  component: PomodoroPage,
});

const FOCUS = 25 * 60;

function PomodoroPage() {
  const [time, setTime] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          window.clearInterval(ref.current!);
          setRunning(false);
          addXP(120);
          toast.success("Focus session complete!", { description: "+120 XP earned" });
          return FOCUS;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (ref.current) window.clearInterval(ref.current); };
  }, [running]);

  const m = Math.floor(time / 60).toString().padStart(2, "0");
  const s = (time % 60).toString().padStart(2, "0");
  const pct = ((FOCUS - time) / FOCUS) * 100;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest font-display text-primary">// Deep Work</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Focus Timer</h1>
      </div>

      <div className="glass-strong rounded-3xl p-10 flex flex-col items-center" style={{ boxShadow: "var(--shadow-purple)" }}>
        <div className="relative h-72 w-72">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(0.25 0.05 270)" strokeWidth="4" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none" stroke="url(#timerG)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray="282.7"
              animate={{ strokeDashoffset: 282.7 - (282.7 * pct) / 100 }}
              transition={{ duration: 0.5 }}
              style={{ filter: "drop-shadow(0 0 6px var(--neon-cyan))" }}
            />
            <defs>
              <linearGradient id="timerG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.85 0.18 195)" />
                <stop offset="100%" stopColor="oklch(0.65 0.27 295)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-6xl font-black gradient-text tabular-nums">{m}:{s}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-display mt-2">
              {running ? "Focusing" : "Ready"}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-primary-foreground hover:scale-105 transition"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-neon)" }}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {running ? "Pause" : "Start"}
          </button>
          <button onClick={() => { setRunning(false); setTime(FOCUS); }} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass font-display font-bold">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-6">Complete a 25-minute session to earn <span style={{ color: "var(--xp)" }}>+120 XP</span></p>
      </div>
    </div>
  );
}
