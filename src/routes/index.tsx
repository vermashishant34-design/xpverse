import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio Nilo — independent design studio" },
      { name: "description", content: "An independent design studio for brand systems, digital products, and quiet interfaces." },
    ],
  }),
  component: Index,
});

const ROTATING = ["think.", "design.", "build.", "ship."];
const CLIENTS = ["Aether", "Northwind", "Lumen", "Polar", "Forma", "Kestrel", "Brava", "Vista", "Mono", "Prism"];

const SERVICES = [
  { n: "01", t: "Brand systems", d: "Identity, naming, art direction, and design systems built to scale across product and surface." },
  { n: "02", t: "Digital products", d: "End-to-end UX/UI for SaaS, mobile, and web applications. From zero to first release." },
  { n: "03", t: "Interface design", d: "Quiet, considered interfaces. Type, grid, motion. The details no one notices and everyone feels." },
  { n: "04", t: "Creative direction", d: "Long-term partnership for in-house teams shaping the next chapter of their product." },
];

const FEATURED = [
  { y: "2025", c: "Aether", t: "A composable banking platform", tag: "product" },
  { y: "2025", c: "Northwind", t: "Identity for a climate fund", tag: "brand" },
  { y: "2024", c: "Lumen", t: "Editorial site & design system", tag: "web" },
  { y: "2024", c: "Polar", t: "Mobile-first analytics suite", tag: "product" },
];

function Index() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx((v) => (v + 1) % ROTATING.length), 1800);
    return () => clearInterval(i);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div style={{ y, opacity }} className="text-center">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-3xl md:text-4xl text-foreground"
          >
            {ROTATING[idx]}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 inset-x-0 px-6 md:px-10 flex items-end justify-between text-[11px] uppercase tracking-[0.2em] text-foreground/50">
          <span>scroll</span>
          <span className="hidden md:block">an independent practice — based everywhere</span>
          <span>v.04</span>
        </div>
      </section>

      {/* Manifesto */}
      <section className="border-t hairline px-6 md:px-10 py-24 md:py-40">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">[ studio ]</p>
          </div>
          <div className="md:col-span-9">
            <p className="text-balance text-2xl md:text-4xl leading-[1.25] font-light">
              <span className="text-foreground">Studio Nilo</span>{" "}
              <span className="text-foreground/55">
                is an independent design studio crafting brand systems, digital products, and quiet interfaces for teams who care about the details.
              </span>
            </p>
            <div className="mt-10 flex gap-6 text-xs uppercase tracking-[0.2em]">
              <Link to="/studio" className="border-b border-foreground pb-1 hover:opacity-60 transition">about the studio →</Link>
              <Link to="/work" className="border-b border-transparent hover:border-foreground/40 pb-1 transition text-foreground/60 hover:text-foreground">selected work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="border-t hairline px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">[ selected work — 2024 / 2025 ]</p>
            <Link to="/work" className="text-xs uppercase tracking-[0.2em] hover:underline underline-offset-4">index →</Link>
          </div>

          <div className="border-t hairline">
            {FEATURED.map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="border-b hairline group"
              >
                <Link to="/work" className="grid grid-cols-12 items-baseline gap-4 py-7 md:py-9 px-1 transition hover:px-3">
                  <span className="col-span-1 text-xs text-muted-foreground">{p.y}</span>
                  <span className="col-span-3 md:col-span-2 text-sm md:text-base">{p.c}</span>
                  <span className="col-span-6 md:col-span-7 text-base md:text-2xl font-light text-foreground/80 group-hover:text-foreground transition">{p.t}</span>
                  <span className="col-span-2 text-right text-xs uppercase tracking-[0.18em] text-muted-foreground">{p.tag} ↗</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t hairline px-6 md:px-10 py-24">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-12">[ what we do ]</p>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {SERVICES.map((s) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="border-t hairline pt-6"
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-xs text-muted-foreground">{s.n}</span>
                  <h3 className="text-2xl md:text-3xl font-light">{s.t}</h3>
                </div>
                <p className="mt-4 text-sm md:text-base text-foreground/60 max-w-md md:ml-12">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee of clients */}
      <section className="border-t hairline py-10 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS].map((c, i) => (
            <span key={i} className="mx-8 text-2xl md:text-4xl font-light text-foreground/60 hover:text-foreground transition">
              {c} <span className="text-foreground/20 mx-2">/</span>
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t hairline px-6 md:px-10 py-32 md:py-48">
        <div className="max-w-[1600px] mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">[ next ]</p>
          <h2 className="text-balance text-4xl md:text-7xl font-light leading-[1.05]">
            Have a project<br />in mind?
          </h2>
          <Link to="/contact" className="inline-block mt-10 text-xs uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:opacity-60 transition">
            start a conversation →
          </Link>
        </div>
      </section>
    </main>
  );
}
