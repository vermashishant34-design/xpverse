import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePlayer, playerStore } from "@/store/player";
import { toast } from "sonner";

export function ScreenTimePanel() {
  const p = usePlayer();
  const today = new Date().toISOString().slice(0, 10);
  const todays = p.screenTime.filter(s => s.date === today);
  const totalMin = todays.reduce((a, s) => a + s.minutes, 0);
  const weightedProd = totalMin > 0
    ? Math.round(todays.reduce((a, s) => a + s.productivity * s.minutes, 0) / totalMin)
    : 0;

  const [app, setApp] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [prod, setProd] = useState(70);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!app.trim()) return;
    playerStore.logScreenTime(app.trim(), Number(minutes) || 0, Math.min(100, Math.max(0, Number(prod) || 0)));
    toast.success(`Logged ${minutes}m on ${app}`);
    setApp("");
  };

  return (
    <div className="rounded-2xl glass p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-xl font-semibold">Screen Time</h3>
        <div className="font-mono text-xs text-muted-foreground">
          {Math.floor(totalMin / 60)}h {totalMin % 60}m · focus {weightedProd}%
        </div>
      </div>

      <form onSubmit={add} className="mt-4 grid grid-cols-12 gap-2">
        <input value={app} onChange={e => setApp(e.target.value)} placeholder="App name"
          className="col-span-5 rounded-md bg-secondary/60 px-3 py-2 text-sm outline-none" />
        <input type="number" value={minutes} onChange={e => setMinutes(Number(e.target.value))} min={0}
          className="col-span-3 rounded-md bg-secondary/60 px-3 py-2 text-sm outline-none" />
        <input type="number" value={prod} onChange={e => setProd(Number(e.target.value))} min={0} max={100}
          className="col-span-2 rounded-md bg-secondary/60 px-3 py-2 text-sm outline-none" />
        <button className="col-span-2 rounded-md bg-foreground text-background font-mono text-xs uppercase tracking-widest">Log</button>
      </form>

      <ul className="mt-4 space-y-2">
        <AnimatePresence>
          {todays.map(s => (
            <motion.li key={s.id} layout
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
              className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
            >
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm">{s.app}</span>
                  <span className="font-mono text-xs text-muted-foreground">{s.minutes}m</span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary/60">
                  <div className="h-full animate-aurora" style={{ width: `${s.productivity}%` }} />
                </div>
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-widest ${s.productivity >= 60 ? "text-neon-cyan" : "text-muted-foreground"}`}>
                {s.productivity}%
              </span>
              <button onClick={() => playerStore.removeScreenTime(s.id)}
                className="font-mono text-[10px] text-muted-foreground hover:text-destructive">✕</button>
            </motion.li>
          ))}
        </AnimatePresence>
        {todays.length === 0 && <li className="text-sm text-muted-foreground">No activity logged today.</li>}
      </ul>
    </div>
  );
}
