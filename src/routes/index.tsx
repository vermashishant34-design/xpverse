import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ParticleField } from "@/components/ParticleField";
import { MouseGlow } from "@/components/MouseGlow";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XPVerse — Turn Your Life Into A Game" },
      { name: "description", content: "Cinematic gamified productivity. Quests, XP, skills, leaderboards." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="relative noise">
      <MouseGlow />

      {/* HERO — Atmospheric Lobby */}
      <section ref={ref} className="relative h-screen overflow-hidden bg-background">
        {/* background image */}
        <div aria-hidden className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt=""
            width={1920}
            height={1080}
            className="h-full w-full object-cover scale-105 opacity-90"
          />
          {/* tonal wash to match palette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_35%,oklch(0.21_0.008_165/0.85)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background" />
          {/* sage scanlines */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.81 0.028 175 / 0.6) 2px, oklch(0.81 0.028 175 / 0.6) 3px)"
          }} />
        </div>

        {/* floating ambient blurs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
          <div className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full bg-accent/15 blur-[120px] animate-float" />
          <div className="absolute bottom-10 right-0 h-[520px] w-[520px] rounded-full bg-primary/15 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-neon-blue/10 blur-[120px] animate-float" style={{ animationDelay: "4s" }} />
        </div>

        {/* nav */}
        <nav className="absolute top-0 left-0 right-0 z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-foreground/20 text-foreground">X</span>
            XPVERSE
          </div>
          <div className="hidden md:flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#system" className="hover:text-foreground transition">System</a>
            <a href="#ai" className="hover:text-foreground transition">AI</a>
          </div>
          <Link to="/character" className="rounded-full border border-foreground/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-foreground/5 transition">● Enter</Link>
        </nav>

        {/* faint particle haze */}
        <div className="absolute inset-0 z-[2] opacity-25">
          <ParticleField density={28} />
        </div>

        {/* center stage */}
        <motion.div style={{ y, opacity }} className="relative z-20 mx-auto flex h-[calc(100vh-120px)] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground"
          >
            ◆  ENTRY LOBBY  ◆
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 font-display font-bold uppercase leading-[0.85] tracking-tighter text-balance"
            style={{ fontSize: "clamp(3.5rem, 13vw, 11rem)" }}
          >
            <span className="block bg-gradient-to-b from-foreground via-foreground/85 to-foreground/30 bg-clip-text text-transparent drop-shadow-[0_4px_30px_oklch(0.95_0.028_215/0.15)]">
              XPVERSE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-2 font-mono text-xs uppercase text-muted-foreground"
          >
            A  LIFE  PLATFORMER
          </motion.p>

          {/* menu */}
          <motion.ul
            initial="hidden" animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 1.4 } } }}
            className="mt-14 space-y-4 font-mono text-sm uppercase tracking-[0.4em]"
          >
            {[
              { label: "Start", to: "/character", primary: true },
              { label: "Dashboard", to: "/dashboard" },
              { label: "Quests", to: "/quests" },
              { label: "Leaderboard", to: "/leaderboard" },
            ].map((item) => (
              <motion.li
                key={item.label}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="group relative"
              >
                <Link to={item.to} className="inline-flex items-center gap-4 px-4 py-1 text-muted-foreground transition hover:text-foreground">
                  <span className={`opacity-0 transition group-hover:opacity-100 ${item.primary ? "text-accent opacity-100 animate-pulse" : ""}`}>▸</span>
                  <span className={item.primary ? "text-foreground" : ""}>{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}
            className="mt-12 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60"
          >
            ✦  Crafted with discipline  ✦
          </motion.p>
        </motion.div>

        {/* bottom HUD bars */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-border/40 bg-background/40 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>BGM</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/5">
                <div className="h-full w-3/4 bg-gradient-to-r from-accent/70 to-primary/40" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span>SFX</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/5">
                <div className="h-full w-1/2 bg-gradient-to-r from-accent/70 to-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <Section id="features" eyebrow="Features" title="A complete RPG, layered over reality.">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl glass p-8 hover:border-white/20 transition"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 blur-3xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="font-mono text-xs uppercase tracking-widest text-neon-cyan">{f.tag}</div>
                <h3 className="mt-4 font-display text-2xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SYSTEM SHOWCASE */}
      <Section id="system" eyebrow="The System" title="XP. Levels. Skills. Loot.">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <h3 className="font-display text-4xl md:text-5xl font-bold">Every action counts.</h3>
            <p className="mt-4 text-muted-foreground max-w-md">
              Read 20 pages. Lift weights. Ship a feature. Each quest you complete
              channels into one of five core skills — Intelligence, Strength,
              Discipline, Creativity, Charisma.
            </p>
            <div className="mt-8 space-y-4">
              {["Intelligence", "Strength", "Discipline", "Creativity", "Charisma"].map((s, i) => (
                <div key={s}>
                  <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                    <span>{s}</span><span className="text-muted-foreground">Lv {12 - i}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary/60">
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: `${85 - i * 12}%` }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 1 }}
                      className="h-full animate-aurora"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="relative aspect-square rounded-3xl glass p-8 overflow-hidden"
          >
            <div className="absolute inset-0 grid-bg opacity-50" />
            <div className="absolute inset-0 animate-aurora opacity-20" />
            <div className="relative grid h-full place-items-center">
              <div className="relative">
                <div className="grid h-48 w-48 place-items-center rounded-full glass-strong glow animate-float">
                  <div className="text-center">
                    <div className="font-mono text-xs uppercase tracking-widest text-neon-cyan">Level</div>
                    <div className="font-display text-7xl font-bold gradient-text">12</div>
                  </div>
                </div>
                {["INT", "STR", "DIS", "CRE", "CHA"].map((s, i) => {
                  const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                  return (
                    <div key={s}
                      className="absolute grid h-14 w-14 place-items-center rounded-full glass font-mono text-[10px]"
                      style={{
                        left: `calc(50% + ${Math.cos(angle) * 130}px - 28px)`,
                        top: `calc(50% + ${Math.sin(angle) * 130}px - 28px)`,
                      }}>
                      {s}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* AI */}
      <Section id="ai" eyebrow="AI Assistant" title="Your personal coach. Always on.">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl glass p-12 md:p-20 text-center"
        >
          <div className="absolute inset-0 animate-aurora opacity-10" />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-purple">Powered by AI</p>
            <h3 className="mt-4 font-display text-4xl md:text-6xl font-bold text-balance">
              Generates quests. Tracks momentum. Pushes you forward.
            </h3>
            <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
              An adaptive AI coach that crafts daily missions tailored to your class,
              writes motivational dispatches, and knows when to push and when to rest.
            </p>
          </div>
        </motion.div>
      </Section>

      {/* TESTIMONIALS */}
      <Section eyebrow="Players" title="Lives, leveled up.">
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl glass p-6"
            >
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple font-bold text-background">{t.name[0]}</div>
                <div>
                  <div className="font-mono text-xs">{t.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Lv {t.lv} · {t.cls}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-5xl md:text-8xl font-bold tracking-tighter"
          >
            The next level <br /><span className="gradient-text">is one quest away.</span>
          </motion.h2>
          <Link to="/character"
            className="mt-12 inline-block rounded-full bg-foreground px-10 py-5 font-mono text-xs uppercase tracking-[0.3em] text-background hover:scale-105 transition">
            Begin →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <div>© 2026 XPVERSE — Reality, gamified.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">Discord</a>
            <a href="#" className="hover:text-foreground">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">— {eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tighter text-balance max-w-3xl">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

const FEATURES = [
  { tag: "01", title: "Real Quests", desc: "Turn your todo list into a quest log. Earn XP and coins for everything you ship." },
  { tag: "02", title: "Skill Tree", desc: "Five core stats grow with the actions you take. Become measurably stronger." },
  { tag: "03", title: "Achievements", desc: "Rare and legendary unlocks. Animated badges. Permanent proof of progress." },
  { tag: "04", title: "Cinematic UI", desc: "An interface that feels like it belongs in 2077. Every interaction designed." },
  { tag: "05", title: "AI Coach", desc: "Adaptive missions and motivation, generated for your class and momentum." },
  { tag: "06", title: "Leaderboard", desc: "Compete globally. Or just with yesterday's version of yourself." },
];

const TESTIMONIALS = [
  { name: "Aria", lv: 24, cls: "Hacker", quote: "I shipped more in a month than the prior six. The level-up animation is genuinely addictive." },
  { name: "Kai", lv: 18, cls: "Monk", quote: "Made discipline feel like a video game. My streak is at 41 days." },
  { name: "Nova", lv: 31, cls: "Entrepreneur", quote: "The AI coach reads my momentum. It actually knows when to push me." },
];
