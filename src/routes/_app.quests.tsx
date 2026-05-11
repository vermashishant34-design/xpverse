import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Swords } from "lucide-react";
import { useState } from "react";
import { usePlayer, addQuest, deleteQuest, completeQuest } from "@/store/player";
import type { Skill } from "@/lib/game-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/quests")({
  head: () => ({ meta: [{ title: "Quests — XPVerse" }] }),
  component: QuestsPage,
});

const SKILLS: Skill[] = ["Intelligence", "Strength", "Wisdom", "Charisma", "Discipline"];
const DIFFS = [
  { label: "Easy", xp: 30 },
  { label: "Medium", xp: 70 },
  { label: "Hard", xp: 150 },
  { label: "Epic", xp: 300 },
] as const;

function QuestsPage() {
  const player = usePlayer();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState<Skill>("Intelligence");
  const [diff, setDiff] = useState<(typeof DIFFS)[number]>(DIFFS[1]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addQuest({ title: title.trim(), skill, xp: diff.xp, difficulty: diff.label });
    toast.success("Quest added", { description: `+${diff.xp} XP awaits` });
    setTitle(""); setOpen(false);
  };

  const handleComplete = (id: string, xp: number) => {
    completeQuest(id);
    toast.success(`+${xp} XP`, { description: "Quest complete" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-display text-primary">// Mission Board</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Quests</h1>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-primary-foreground hover:scale-105 transition"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-neon)" }}>
          <Plus className="h-4 w-4" /> New Quest
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {player.quests.map((q) => (
          <motion.div
            key={q.id}
            layout
            whileHover={{ y: -3 }}
            className={`glass rounded-2xl p-5 relative overflow-hidden ${q.completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--gradient-primary)" }}>
                  <Swords className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h3 className={`font-display font-bold ${q.completed ? "line-through" : ""}`}>{q.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary font-display">{q.skill}</span>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{q.difficulty}</span>
                    <span className="font-display font-bold" style={{ color: "var(--xp)" }}>+{q.xp} XP</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!q.completed && (
                  <button onClick={() => handleComplete(q.id, q.xp)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition" aria-label="Complete">
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => deleteQuest(q.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onSubmit={submit}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl p-6 w-full max-w-md space-y-4"
              style={{ boxShadow: "var(--shadow-purple)" }}
            >
              <h2 className="font-display text-xl font-bold">New Quest</h2>
              <input
                autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master React Hooks"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary outline-none font-sans"
              />
              <div>
                <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Skill</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {SKILLS.map((s) => (
                    <button key={s} type="button" onClick={() => setSkill(s)}
                      className={`px-3 py-2 rounded-lg text-sm font-display border transition ${skill === s ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Difficulty</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {DIFFS.map((d) => (
                    <button key={d.label} type="button" onClick={() => setDiff(d)}
                      className={`px-2 py-2 rounded-lg text-xs font-display border transition ${diff.label === d.label ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {d.label}<br /><span style={{ color: "var(--xp)" }}>+{d.xp}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg font-display font-bold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}>Create</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
