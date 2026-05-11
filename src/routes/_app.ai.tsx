import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { usePlayer, playerStore } from "@/store/player";
import { toast } from "sonner";

const SKILLS = ["intelligence", "strength", "discipline", "creativity", "charisma"] as const;

const TEMPLATES: Record<string, { title: string; skill: typeof SKILLS[number] }[]> = {
  Hacker: [
    { title: "Ship one feature today", skill: "intelligence" },
    { title: "Read a security writeup", skill: "intelligence" },
    { title: "Refactor messy code", skill: "discipline" },
  ],
  Warrior: [
    { title: "45 min strength training", skill: "strength" },
    { title: "Cold shower", skill: "discipline" },
    { title: "Run 5K", skill: "strength" },
  ],
  Monk: [
    { title: "20 min meditation", skill: "discipline" },
    { title: "Journal three pages", skill: "creativity" },
    { title: "Phone-free morning", skill: "discipline" },
  ],
  Developer: [
    { title: "Build a side-project feature", skill: "creativity" },
    { title: "Review open-source PR", skill: "intelligence" },
    { title: "Write a blog post", skill: "charisma" },
  ],
  Entrepreneur: [
    { title: "Talk to one customer", skill: "charisma" },
    { title: "Plan tomorrow's top 3", skill: "discipline" },
    { title: "Sketch a new offer", skill: "creativity" },
  ],
};

const QUOTES = [
  "Discipline equals freedom. Push.",
  "Tomorrow is built today.",
  "You don't rise to your goals. You fall to your systems.",
  "The grind is the gift.",
  "Become unrecognizable.",
];

export const Route = createFileRoute("/_app/ai")({
  head: () => ({ meta: [{ title: "AI Coach — XPVerse" }] }),
  component: AI,
});

function AI() {
  const p = usePlayer();
  const [generated, setGenerated] = useState<{ title: string; skill: typeof SKILLS[number] }[]>([]);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const pool = TEMPLATES[p.charClass] || TEMPLATES.Hacker;
      setGenerated([...pool].sort(() => Math.random() - 0.5).slice(0, 3));
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
      setLoading(false);
    }, 700);
  };

  const accept = (q: { title: string; skill: typeof SKILLS[number] }) => {
    playerStore.addQuest(q.title, q.skill);
    setGenerated(g => g.filter(x => x.title !== q.title));
    toast.success("Quest added to your log.");
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-purple">— Adaptive Coach</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold tracking-tighter">
          Your AI <span className="gradient-text">strategist.</span>
        </h1>
      </header>

      <motion.div className="relative overflow-hidden rounded-3xl glass p-10">
        <div className="absolute inset-0 animate-aurora opacity-10" />
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-widest text-neon-cyan">Dispatch</p>
          <motion.p key={quote}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-display text-3xl md:text-4xl font-semibold text-balance">"{quote}"</motion.p>
        </div>
      </motion.div>

      <div className="rounded-3xl glass p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold">Daily missions for {p.charClass}</h3>
            <p className="text-sm text-muted-foreground">Generated based on your class and momentum.</p>
          </div>
          <button onClick={generate}
            className="rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest text-background hover:scale-105 transition disabled:opacity-50"
            disabled={loading}>
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {generated.length === 0 && <p className="text-sm text-muted-foreground font-mono">No missions queued. Tap Generate.</p>}
          {generated.map((q, i) => (
            <motion.div key={q.title}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between rounded-xl bg-white/5 px-5 py-4"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">{q.skill}</div>
                <div className="mt-1 font-display text-lg">{q.title}</div>
              </div>
              <button onClick={() => accept(q)}
                className="rounded-full glass-strong px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition">
                Accept
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
