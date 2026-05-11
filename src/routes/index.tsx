import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, Swords, Trophy, Sparkles, Timer, Brain, ArrowRight, Star } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XPVerse — Turn your life into an RPG" },
      { name: "description", content: "Earn XP for real-world tasks, level up, unlock skills, and dominate the leaderboard. Cyberpunk productivity for ambitious heroes." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Swords, title: "Quest System", desc: "Turn every task into a mission with XP rewards." },
  { icon: Sparkles, title: "Skill Tree", desc: "Grow Intelligence, Strength, Wisdom, Charisma, Discipline." },
  { icon: Trophy, title: "Leaderboard", desc: "Compete globally for the top of the rankings." },
  { icon: Timer, title: "Focus Timer", desc: "Pomodoro sessions that pay out in pure XP." },
  { icon: Brain, title: "AI Quests", desc: "Personalized missions generated for your goals." },
  { icon: Zap, title: "Level Up", desc: "Unlock ranks: Apprentice, Elite, Legend." },
];

const stats = [
  { value: "12K+", label: "Heroes" },
  { value: "480K", label: "Quests Done" },
  { value: "3.2M", label: "XP Earned" },
  { value: "98%", label: "Stay Consistent" },
];

const testimonials = [
  { name: "Alex K.", role: "Indie Dev", text: "Finally, a productivity app that doesn't feel like a chore. I'm Level 24 and on a 47-day streak." },
  { name: "Mia R.", role: "Founder", text: "XPVerse reframes my whole day. Hitting 'Complete Quest' is dangerously satisfying." },
  { name: "Jordan T.", role: "Student", text: "The skill tree made me realize I was neglecting Wisdom. Reading 30 mins a day now." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />

      {/* Nav */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" style={{ filter: "drop-shadow(0 0 8px var(--neon-cyan))" }} />
          <span className="font-display text-xl font-bold gradient-text">XPVerse</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-primary transition">Features</a>
          <a href="#stats" className="hover:text-primary transition">Stats</a>
          <a href="#testimonials" className="hover:text-primary transition">Heroes</a>
        </nav>
        <Link to="/login" className="font-display text-sm font-bold px-4 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition">
          Login
        </Link>
      </header>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-32 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-display tracking-widest uppercase text-primary mb-6">
            <Star className="h-3 w-3" /> Season 01 — Live Now
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6">
            Your life is a <br />
            <span className="gradient-text">role-playing game.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            XPVerse turns your goals, habits, and focus sessions into XP, quests, and rank-ups.
            Build the character you've always wanted to be.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/character" className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-primary-foreground transition-all hover:scale-105"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-neon)" }}>
              Start Your Journey <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/dashboard" className="px-8 py-4 rounded-xl glass font-display font-bold hover:border-primary/60 transition">
              Enter Demo
            </Link>
          </div>
        </motion.div>

        {/* Floating HUD card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 mx-auto max-w-3xl glass-strong rounded-2xl p-6 relative scanline overflow-hidden"
          style={{ boxShadow: "var(--shadow-purple)" }}
        >
          <div className="grid grid-cols-3 gap-4 text-left">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-display">Hero</div>
              <div className="font-display text-xl text-primary mt-1">Cipher_07</div>
              <div className="text-xs text-muted-foreground mt-1">Hacker · Lv 24</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-display">XP</div>
              <div className="font-display text-2xl gradient-text mt-1">8,420</div>
              <div className="h-1.5 mt-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-3/4 rounded-full" style={{ background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))" }} />
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-display">Streak</div>
              <div className="font-display text-2xl mt-1" style={{ color: "var(--neon-pink)" }}>47 🔥</div>
              <div className="text-xs text-muted-foreground mt-1">Personal best</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="font-display text-4xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-display">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest font-display text-primary">// Arsenal</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">Everything a hero needs.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-6 group relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/30 transition" />
                <div className="relative">
                  <div className="inline-flex p-3 rounded-xl mb-4" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-neon)" }}>
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest font-display text-primary">// Heroes Speak</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">Voices from the verse.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" style={{ color: "var(--xp)" }} />
                ))}
              </div>
              <p className="text-sm text-foreground/90 mb-4">"{t.text}"</p>
              <div className="font-display text-sm text-primary">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24 max-w-4xl mx-auto text-center">
        <div className="glass-strong rounded-3xl p-12 relative overflow-hidden" style={{ boxShadow: "var(--shadow-purple)" }}>
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Ready to <span className="gradient-text">level up</span>?</h2>
            <p className="text-muted-foreground mb-8">Create your hero in 60 seconds. Free forever.</p>
            <Link to="/character" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-primary-foreground hover:scale-105 transition"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-neon)" }}>
              Begin <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border/50 px-6 py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-display">XPVerse © 2026</span>
          </div>
          <div>Built for heroes. Powered by ambition.</div>
        </div>
      </footer>
    </div>
  );
}
