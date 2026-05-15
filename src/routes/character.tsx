import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { playerStore, usePlayer } from "@/store/player";
import { ParticleField } from "@/components/ParticleField";

const CLASSES = [
  { name: "Hacker", icon: "⌬", desc: "Mind over matter. Codebreaker." },
  { name: "Warrior", icon: "⚔", desc: "Forged in iron. Built to endure." },
  { name: "Monk", icon: "☯", desc: "Stillness. Focus. Mastery." },
  { name: "Developer", icon: "{}", desc: "Architect of systems and worlds." },
  { name: "Entrepreneur", icon: "◈", desc: "Risk-taker. Empire builder." },
];

const AVATARS = ["◉", "◆", "▲", "✦", "✧", "◐"];

export const Route = createFileRoute("/character")({
  head: () => ({ meta: [{ title: "Forge Your Identity — XPVerse" }] }),
  component: Character,
});

function Character() {
  const p = usePlayer();
  const nav = useNavigate();
  const [username, setUsername] = useState(p.username === "Wanderer" ? "" : p.username);
  const [avatar, setAvatar] = useState(p.avatar);
  const [cls, setCls] = useState(p.charClass);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    playerStore.set({ username: username.trim(), avatar, charClass: cls, created: true });
    nav({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden grid-bg noise">
      <ParticleField density={50} />
      <Link to="/" className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition">
        ← Back to home
      </Link>
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">— Initialization</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl font-bold tracking-tighter">
            Forge your <span className="gradient-text">identity.</span>
          </h1>
        </motion.div>

        <form onSubmit={submit} className="mt-12 space-y-10">
          <Field label="Codename">
            <input value={username} onChange={e => setUsername(e.target.value)}
              placeholder="enter your handle…" autoFocus
              className="w-full bg-transparent border-b border-white/20 focus:border-neon-cyan px-1 py-3 font-display text-3xl outline-none" />
          </Field>

          <Field label="Avatar">
            <div className="grid grid-cols-6 gap-3">
              {AVATARS.map(a => (
                <button type="button" key={a} onClick={() => setAvatar(a)}
                  className={`grid aspect-square place-items-center rounded-2xl glass text-3xl transition ${avatar === a ? "border-neon-cyan glow scale-105" : "hover:border-white/20"}`}>
                  {a}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Class">
            <div className="grid gap-3 md:grid-cols-2">
              {CLASSES.map(c => (
                <button type="button" key={c.name} onClick={() => setCls(c.name)}
                  className={`flex items-center gap-4 rounded-2xl glass p-4 text-left transition ${cls === c.name ? "border-neon-purple glow" : "hover:border-white/20"}`}>
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple font-display text-2xl">{c.icon}</span>
                  <div>
                    <div className="font-display text-lg font-semibold">{c.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Field>

          <button type="submit"
            disabled={!username.trim()}
            className="w-full rounded-full bg-foreground py-5 font-mono text-xs uppercase tracking-[0.3em] text-background hover:scale-[1.01] transition disabled:opacity-30">
            Begin →
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">— {label}</div>
      {children}
    </div>
  );
}
