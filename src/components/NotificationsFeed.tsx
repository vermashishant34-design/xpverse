import { motion, AnimatePresence } from "framer-motion";
import { usePlayer, playerStore } from "@/store/player";

const TONE: Record<string, string> = {
  xp: "text-neon-cyan",
  level: "text-neon-purple",
  quest: "text-foreground",
  skill: "text-accent",
  info: "text-muted-foreground",
};

export function NotificationsFeed() {
  const p = usePlayer();
  return (
    <div className="rounded-2xl glass p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-xl font-semibold">Live Notifications</h3>
        {p.notifications.length > 0 && (
          <button onClick={() => playerStore.clearNotifications()}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">Clear</button>
        )}
      </div>
      <ul className="mt-4 space-y-2 max-h-72 overflow-auto">
        <AnimatePresence initial={false}>
          {p.notifications.map(n => (
            <motion.li key={n.id} layout
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30 }}
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2"
            >
              <span className={`font-mono text-xs ${TONE[n.tone]}`}>{n.text}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {new Date(n.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
        {p.notifications.length === 0 && (
          <li className="text-sm text-muted-foreground">Quiet for now. Complete a quest.</li>
        )}
      </ul>
    </div>
  );
}
