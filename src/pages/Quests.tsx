import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePlayer, playerStore, type Skills } from "@/store/player";
import { LevelUpOverlay } from "@/components/LevelUpOverlay";
import { toast } from "sonner";

export default function Quests() {
  const p = usePlayer();
  const [levelUp, setLevelUp] = useState(false);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number; xp: number }[]>([]);
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState<keyof Skills>("intelligence");

  const onComplete = (id: string, e: React.MouseEvent) => {
    const r = playerStore.completeQuest(id);
    if (!r.xpGained) return;
    const fid = Date.now();
    setFloats(f => [...f, { id: fid, x: e.clientX, y: e.clientY, xp: r.xpGained }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== fid)), 1500);
    if (r.leveledUp) setLevelUp(true);
    else toast.success(`+${r.xpGained} XP earned`);
  };

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    playerStore.addQuest(title.trim(), skill);
    setTitle("");
    toast.success("Quest forged.");
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">— Quest Log</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold tracking-tighter">Today's Missions</h1>
      </header>

      <form onSubmit={onAdd} className="flex flex-col md:flex-row gap-3 rounded-2xl glass p-4">
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Forge a new quest…"
          className="flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-muted-foreground" />
        <select value={skill} onChange={e => setSkill(e.target.value as keyof Skills)}
          className="rounded-md bg-secondary/60 px-3 py-2 font-mono text-xs uppercase tracking-widest">
          {(["intelligence","strength","discipline","creativity","charisma"] as const).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="rounded-md bg-foreground px-5 py-2 font-mono text-xs uppercase tracking-widest text-background hover:scale-[1.02] transition">Add</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence>
          {p.quests.map(q => (
            <motion.div key={q.id}
              layout
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 100 }}
              className={`group relative overflow-hidden rounded-2xl glass p-6 transition ${q.done ? "opacity-50" : "hover:border-white/20 hover:glow"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">{q.skill}</div>
                  <h3 className="mt-1 font-display text-xl font-semibold">{q.title}</h3>
                  <div className="mt-2 flex gap-3 font-mono text-xs text-muted-foreground">
                    <span>+{q.xp} XP</span><span>+{q.coins}¤</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    disabled={q.done}
                    onClick={(e) => onComplete(q.id, e)}
                    className="rounded-full glass-strong px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-50"
                  >
                    {q.done ? "✓ Done" : "Complete"}
                  </button>
                  <button
                    onClick={() => { playerStore.deleteQuest(q.id); toast("Quest removed"); }}
                    className="rounded-full glass-strong px-3 py-2 font-mono text-xs uppercase tracking-widest hover:bg-destructive/30 hover:text-destructive transition"
                    aria-label="Delete quest"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {floats.map(f => (
          <motion.div key={f.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -100, scale: 1.4 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="pointer-events-none fixed z-[200] font-display text-3xl font-bold gradient-text"
            style={{ left: f.x, top: f.y }}
          >+{f.xp} XP</motion.div>
        ))}
      </AnimatePresence>

      <LevelUpOverlay show={levelUp} level={p.level} onClose={() => setLevelUp(false)} />
    </div>
  );
}
