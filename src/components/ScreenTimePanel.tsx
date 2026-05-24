import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { usePlayer, playerStore } from "@/store/player";
import { toast } from "sonner";

export function ScreenTimePanel() {
  const p = usePlayer();
  const today = new Date().toISOString().slice(0, 10);
  const todays = p.screenTime.filter((s) => s.date === today);
  const totalMin = todays.reduce((a, s) => a + s.minutes, 0);
  const weightedProd = totalMin > 0
    ? Math.round(todays.reduce((a, s) => a + s.productivity * s.minutes, 0) / totalMin)
    : 0;

  const [app, setApp] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [prod, setProd] = useState(70);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const lastActiveRef = useRef<number>(Date.now());

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
      } else {
        setIsActive(true);
        lastActiveRef.current = Date.now();
      }
    };

    const handleActivity = () => {
      setIsActive(true);
      lastActiveRef.current = Date.now();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);
    document.addEventListener("click", handleActivity);

    intervalRef.current = window.setInterval(() => {
      if (isActive && !document.hidden) {
        setActiveSeconds((prev) => {
          const newSeconds = prev + 1;
          if (newSeconds % 60 === 0) {
            const existingXpVerse = p.screenTime.filter(s => s.date === new Date().toISOString().slice(0, 10)).find((s) => s.app === "XPVerse");
            if (existingXpVerse) {
              playerStore.removeScreenTime(existingXpVerse.id);
              playerStore.logScreenTime("XPVerse", existingXpVerse.minutes + 1, 100);
            } else {
              playerStore.logScreenTime("XPVerse", 1, 100);
            }
          }
          return newSeconds;
        });
      }
    }, 1000);

    if (!document.hidden) {
      setIsActive(true);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
      document.removeEventListener("click", handleActivity);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, p.screenTime]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!app.trim()) return;
    playerStore.logScreenTime(app.trim(), Number(minutes) || 0, Math.min(100, Math.max(0, Number(prod) || 0)));
    toast.success(`Logged ${minutes}m on ${app}`);
    setApp("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl glass p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-xl font-semibold">Screen Time</h3>
        <div className="font-mono text-xs text-muted-foreground">
          {Math.floor(totalMin / 60)}h {totalMin % 60}m · focus {weightedProd}%
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-xs text-neon-cyan uppercase tracking-widest">Active on XPVerse</div>
            <div className="font-display text-3xl font-bold mt-1">{formatTime(activeSeconds)}</div>
          </div>
          <div className={`h-3 w-3 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
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
