import { motion } from "framer-motion";
import { useState } from "react";
import { playerStore, usePlayer } from "@/store/player";
import { ParticleField } from "@/components/ParticleField";
import { Link, useNavigate } from "react-router-dom";

const CLASSES = [
  { name: "Hacker", icon: "⌬", desc: "Mind over matter. Codebreaker." },
  { name: "Warrior", icon: "⚔", desc: "Forged in iron. Built to endure." },
  { name: "Monk", icon: "☯", desc: "Stillness. Focus. Mastery." },
  { name: "Developer", icon: "{}", desc: "Architect of systems and worlds." },
  { name: "Entrepreneur", icon: "◈", desc: "Risk-taker. Empire builder." },
  { name: "Student", icon: "📚", desc: "Curiosity. Learning. Growth." },
];

const AVATARS = ["◉", "◆", "▲", "✦", "✧", "◐"];

export default function Character() {
  const p = usePlayer();
  const nav = useNavigate();
  const [displayName, setDisplayName] = useState(p.displayName || p.username || "");
  const [avatar, setAvatar] = useState(p.avatar);
  const [cls, setCls] = useState<string>("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedDisplayName = displayName.trim();
    
    // Generate a unique username from display name
    let username = trimmedDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    let counter = 1;
    while (!playerStore.isUsernameUnique(username)) {
      username = `${trimmedDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '_')}${counter}`;
      counter++;
    }

    playerStore.createUser(username);
    playerStore.set({ 
      username, 
      displayName: trimmedDisplayName, 
      avatar, 
      charClass: cls, 
      created: true 
    });
    nav("/dashboard");
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
            Forge your <span className="gradient-text">identity</span>.
          </h1>
        </motion.div>

        <form onSubmit={submit} className="mt-12 space-y-10">
            <Field label="Display Name">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="what should we call you?"
                autoFocus
                className="w-full bg-transparent border-b border-white/20 focus:border-neon-cyan px-1 py-3 font-display text-3xl outline-none"
              />
              <p className="mt-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                This is what will appear on your profile
              </p>
            </Field>

            <Field label="Avatar">
              <div className="grid grid-cols-6 gap-3">
                {AVATARS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`grid aspect-square place-items-center rounded-2xl glass text-3xl transition-all duration-200 ${
                      avatar === a 
                        ? "border-3 border-neon-cyan shadow-[0_0_40px_rgba(0,255,255,0.7)] bg-neon-cyan/20 scale-110" 
                        : "hover:border-white/30 hover:bg-white/5"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Class">
              <div className="grid gap-4 md:grid-cols-2">
                {CLASSES.map((c) => (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => setCls(c.name)}
                    className={`flex items-center gap-4 rounded-2xl glass p-6 text-left transition-all duration-200 ${
                      cls === c.name 
                        ? "border-4 border-neon-purple shadow-[0_0_60px_rgba(168,85,247,0.9)] bg-neon-purple/30 scale-[1.03]" 
                        : "hover:border-white/30 hover:bg-white/5"
                    }`}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple font-display text-2xl">
                      {c.icon}
                    </span>
                    <div>
                      <div className={`font-display text-lg font-semibold ${cls === c.name ? "text-neon-purple" : ""}`}>{c.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{c.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </Field>

            <button
              type="submit"
              disabled={!displayName.trim()}
              className="w-full rounded-full bg-foreground py-5 font-mono text-xs uppercase tracking-[0.3em] text-background hover:scale-[1.01] transition disabled:opacity-30"
            >
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
