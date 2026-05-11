import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio — Studio Nilo" },
      { name: "description", content: "An independent design studio. Small, focused, fully senior." },
    ],
  }),
  component: Studio,
});

const PRINCIPLES = [
  { n: "01", t: "Less, but better.", d: "We design with restraint. Every element earns its place, or it leaves." },
  { n: "02", t: "Slow is fast.", d: "Considered work compounds. We protect the time that good ideas need." },
  { n: "03", t: "Systems over screens.", d: "We build foundations that outlast the brief — type, grid, language, motion." },
  { n: "04", t: "Make the invisible felt.", d: "The details no one notices are the ones that make the work feel right." },
];

const RECOGNITION = [
  { y: "2025", t: "Awwwards — Site of the Day" },
  { y: "2024", t: "Type Directors Club — Certificate" },
  { y: "2024", t: "Brand New — Noted" },
  { y: "2023", t: "CSS Design Awards — Honorable" },
];

function Studio() {
  return (
    <main className="pt-32 px-6 md:px-10 pb-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Intro */}
        <div className="grid md:grid-cols-12 gap-6 mb-24 md:mb-40">
          <p className="md:col-span-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">[ the studio ]</p>
          <div className="md:col-span-9 space-y-8">
            <h1 className="text-balance text-4xl md:text-6xl font-light leading-[1.05]">
              <span className="text-foreground">A small, fully senior studio.</span>{" "}
              <span className="text-foreground/45">Working with founders and in-house teams to shape brands and products that age well.</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/60 max-w-2xl leading-relaxed font-sans font-light">
              Studio Nilo is a remote-first practice founded in 2024. We partner with a handful of clients each year — long enough to do the work properly, small enough to stay close to the craft. No account managers. No layers. Just the people doing the work, in the room.
            </p>
          </div>
        </div>

        {/* Principles */}
        <section className="border-t hairline pt-16 mb-32">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-12">[ how we work ]</p>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="border-t hairline pt-6"
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-xs text-muted-foreground">{p.n}</span>
                  <h3 className="text-2xl md:text-3xl font-light">{p.t}</h3>
                </div>
                <p className="mt-4 text-sm md:text-base text-foreground/60 md:ml-12 max-w-md">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="border-t hairline pt-16 mb-32">
          <div className="grid md:grid-cols-12 gap-6">
            <p className="md:col-span-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">[ process ]</p>
            <div className="md:col-span-9 grid md:grid-cols-3 gap-8">
              {[
                { n: "1", t: "Listen", d: "Two weeks of unhurried discovery — strategy, research, interviews, references." },
                { n: "2", t: "Shape", d: "Concepts, prototypes, decisions. We write as we design and design as we write." },
                { n: "3", t: "Ship", d: "Production, handover, and a system your team can carry forward without us." },
              ].map((s) => (
                <div key={s.n}>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">phase {s.n}</div>
                  <h4 className="text-2xl font-light mb-2">{s.t}.</h4>
                  <p className="text-sm text-foreground/60">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition */}
        <section className="border-t hairline pt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-12">[ recognition ]</p>
          <div className="border-t hairline">
            {RECOGNITION.map((r) => (
              <div key={r.t} className="grid grid-cols-12 items-baseline gap-4 py-5 border-b hairline">
                <span className="col-span-2 text-xs text-muted-foreground">{r.y}</span>
                <span className="col-span-10 text-base md:text-lg font-light">{r.t}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
