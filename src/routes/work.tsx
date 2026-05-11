import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Studio Nilo" },
      { name: "description", content: "Selected projects and case studies from Studio Nilo." },
    ],
  }),
  component: Work,
});

const PROJECTS = [
  { y: "2025", c: "Aether",     t: "A composable banking platform",     tag: "product",   role: "Product design, system" },
  { y: "2025", c: "Northwind",  t: "Identity for a climate fund",       tag: "brand",     role: "Brand, art direction" },
  { y: "2024", c: "Lumen",      t: "Editorial site & design system",    tag: "web",       role: "Web, system" },
  { y: "2024", c: "Polar",      t: "Mobile-first analytics suite",      tag: "product",   role: "Product, motion" },
  { y: "2024", c: "Forma",      t: "Type-led portfolio for a sculptor", tag: "web",       role: "Art direction, web" },
  { y: "2023", c: "Kestrel",    t: "Wayfinding for a research lab",     tag: "spatial",   role: "Brand, signage" },
  { y: "2023", c: "Brava",      t: "Packaging for a coffee roastery",   tag: "brand",     role: "Brand, print" },
  { y: "2023", c: "Vista",      t: "Real-estate platform redesign",     tag: "product",   role: "Product, system" },
  { y: "2022", c: "Mono",       t: "A typography journal",              tag: "editorial", role: "Editorial, web" },
  { y: "2022", c: "Prism",      t: "Color tooling for design teams",    tag: "product",   role: "Product, brand" },
];

function Work() {
  return (
    <main className="pt-32 px-6 md:px-10 pb-24">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-12 gap-6 mb-16 md:mb-24">
          <p className="md:col-span-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">[ index — work ]</p>
          <h1 className="md:col-span-9 text-balance text-4xl md:text-6xl font-light leading-[1.05]">
            <span className="text-foreground">Selected projects</span>{" "}
            <span className="text-foreground/45">across brand, product, and the spaces in between.</span>
          </h1>
        </div>

        <div className="border-t hairline">
          <div className="grid grid-cols-12 gap-4 py-3 px-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-b hairline">
            <span className="col-span-1">year</span>
            <span className="col-span-3 md:col-span-2">client</span>
            <span className="col-span-5 md:col-span-6">project</span>
            <span className="col-span-3 hidden md:block">role</span>
            <span className="col-span-3 md:col-span-1 text-right">tag</span>
          </div>

          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
              className="border-b hairline group"
            >
              <Link to="/contact" className="grid grid-cols-12 items-baseline gap-4 py-6 md:py-8 px-1 transition hover:px-3">
                <span className="col-span-1 text-xs text-muted-foreground">{p.y}</span>
                <span className="col-span-3 md:col-span-2 text-sm">{p.c}</span>
                <span className="col-span-5 md:col-span-6 text-base md:text-xl font-light text-foreground/80 group-hover:text-foreground transition">{p.t}</span>
                <span className="hidden md:block col-span-3 text-xs text-muted-foreground">{p.role}</span>
                <span className="col-span-3 md:col-span-1 text-right text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{p.tag}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-16 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          [ {PROJECTS.length} projects shown · select case studies on request ]
        </p>
      </div>
    </main>
  );
}
