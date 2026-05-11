import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { characterClasses } from "@/lib/game-data";
import { setPlayer } from "@/store/player";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/character")({
  head: () => ({ meta: [{ title: "Create Hero — XPVerse" }] }),
  component: CharacterCreate,
});

const AVATARS = ["🦊","🐉","🤖","🥷","🧙","👾","🦅","🐺","⚔️","🚀"];

function CharacterCreate() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [cls, setCls] = useState(characterClasses[0].id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setPlayer((p) => ({ ...p, username: name.trim(), avatar, charClass: cls }));
    toast.success("Hero created", { description: "Your journey begins now." });
    nav({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen p-4 md:p-10">
      <ParticleBackground />
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest font-display text-primary">// Genesis</p>
          <h1 className="font-display text-4xl md:text-5xl font-black mt-2">Create your <span className="gradient-text">hero</span></h1>
        </motion.div>

        <form onSubmit={submit} className="glass-strong rounded-3xl p-6 md:p-8 space-y-6" style={{ boxShadow: "var(--shadow-purple)" }}>
          <div>
            <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Hero Name</label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cipher_07" required
              className="mt-2 w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary outline-none font-display" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Avatar</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {AVATARS.map((a) => (
                <button key={a} type="button" onClick={() => setAvatar(a)}
                  className={`h-14 w-14 rounded-xl text-3xl border transition ${avatar === a ? "border-primary bg-primary/15 scale-110" : "border-border hover:border-primary/50"}`}
                  style={avatar === a ? { boxShadow: "var(--shadow-neon)" } : undefined}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Choose a Class</label>
            <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {characterClasses.map((c) => (
                <motion.button
                  type="button" key={c.id} onClick={() => setCls(c.id)} whileHover={{ y: -3 }}
                  className={`p-4 rounded-xl border text-left transition ${cls === c.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                  style={cls === c.id ? { boxShadow: "var(--shadow-neon)" } : undefined}
                >
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className="font-display font-bold">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-4 rounded-xl font-display font-bold text-primary-foreground hover:scale-[1.01] transition flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-neon)" }}>
            Begin the journey <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
