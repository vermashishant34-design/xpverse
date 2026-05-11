import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { usePlayer } from "@/store/player";

const FAKE = [
  { name: "Zenith", lv: 47, xp: 18420, cls: "Monk" },
  { name: "Vex", lv: 42, xp: 16100, cls: "Hacker" },
  { name: "Nova", lv: 38, xp: 14200, cls: "Entrepreneur" },
  { name: "Kairo", lv: 33, xp: 11800, cls: "Warrior" },
  { name: "Lyra", lv: 29, xp: 9700, cls: "Developer" },
  { name: "Ash", lv: 24, xp: 7800, cls: "Hacker" },
  { name: "Mira", lv: 21, xp: 6500, cls: "Monk" },
];

export const Route = createFileRoute("/_app/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — XPVerse" }] }),
  component: Leaderboard,
});

type Row = { name: string; lv: number; xp: number; cls: string; isMe?: boolean };
function Leaderboard() {
  const p = usePlayer();
  const me: Row = { name: p.username, lv: p.level, xp: p.xp + p.level * 200, cls: p.charClass, isMe: true };
  const all: Row[] = [...FAKE, me].sort((a, b) => b.xp - a.xp);
  const top3 = all.slice(0, 3);
  const rest = all.slice(3);

  return (
    <div className="space-y-12">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">— Global Ranking</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold tracking-tighter">Leaderboard</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 0, 2].map((i) => {
          const u = top3[i]; if (!u) return null;
          const heights = ["md:mt-0", "md:-mt-8", "md:mt-4"];
          return (
            <motion.div key={u.name}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              className={`relative rounded-3xl glass p-8 text-center ${heights[i]} ${("isMe" in u && u.isMe) ? "border-neon-purple glow" : ""}`}
            >
              <div className="font-display text-5xl font-bold gradient-text">#{i + 1}</div>
              <div className="mx-auto mt-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple font-bold text-background">{u.name[0]}</div>
              <div className="mt-3 font-display text-xl font-semibold">{u.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Lv {u.lv} · {u.cls}</div>
              <div className="mt-3 font-mono text-sm text-neon-cyan">{u.xp.toLocaleString()} XP</div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl glass divide-y divide-white/5">
        {rest.map((u, i) => (
          <motion.div key={u.name}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-between px-6 py-4 ${("isMe" in u && u.isMe) ? "bg-neon-purple/10" : ""}`}
          >
            <div className="flex items-center gap-4">
              <span className="w-8 font-mono text-sm text-muted-foreground">#{i + 4}</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple font-bold text-background">{u.name[0]}</span>
              <div>
                <div className="font-display text-base">{u.name} {("isMe" in u && u.isMe) && <span className="text-neon-cyan font-mono text-[10px] uppercase">· you</span>}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Lv {u.lv} · {u.cls}</div>
              </div>
            </div>
            <div className="font-mono text-sm">{u.xp.toLocaleString()} XP</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
